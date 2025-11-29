#!/usr/bin/env python3
import sys
import os
import rawpy
from PIL import Image
from io import BytesIO

def arw_to_jpg_max_output(input_path,
                          output_path,
                          max_output_mb=5.0,
                          initial_quality=95,
                          min_quality=25,
                          quality_step=5,
                          resize_factor=0.9,
                          min_width=400,
                          min_height=300,
                          jpeg_opts_extra=None):
    """
    Convert ARW (raw) -> JPEG ensuring output size <= max_output_mb.
    Strategy:
      1. Render raw to RGB.
      2. Try saving with descending JPEG quality until size ok or min_quality reached.
      3. If still too large, downscale the image by resize_factor and repeat.
    Returns True if conversion produced a file <= max_output_mb, False otherwise.
    """
    max_bytes = int(max_output_mb * 1024 * 1024)

    # Read raw
    try:
        with rawpy.imread(input_path) as raw:
            # postprocess to 8-bit RGB numpy array
            rgb = raw.postprocess(output_bps=8, use_camera_wb=True)
    except Exception as e:
        print(f"Error reading RAW '{input_path}': {e}")
        return False

    img = Image.fromarray(rgb)
    width, height = img.size
    print(f"Input: {input_path} ({os.path.getsize(input_path)/(1024*1024):.2f} MB), "
          f"initial resolution {width}x{height}")

    # Default extra options for PIL save
    if jpeg_opts_extra is None:
        jpeg_opts_extra = {"optimize": True}

    current_img = img.copy()
    current_quality = initial_quality

    attempt = 0
    while True:
        attempt += 1
        # Try qualities descending
        q = current_quality
        while q >= min_quality:
            attempt += 1
            buf = BytesIO()
            try:
                current_img.save(buf, format="JPEG", quality=q, **jpeg_opts_extra)
            except OSError:
                # If optimize=True fails for very large images, try without optimize
                current_img.save(buf, format="JPEG", quality=q)
            size = buf.tell()
            print(f"Try: quality={q}, size={(size/(1024*1024)):.2f} MB")
            if size <= max_bytes:
                # write to disk
                with open(output_path, "wb") as f:
                    f.write(buf.getvalue())
                print(f"Saved: {output_path} — {(size/(1024*1024)):.2f} MB (quality={q})")
                return True
            q -= quality_step

        # If we exit qualities loop, size still too big -> downscale
        w, h = current_img.size
        new_w = int(w * resize_factor)
        new_h = int(h * resize_factor)

        if new_w < min_width or new_h < min_height:
            print("Cannot reduce image further without going below minimum dimensions.")
            break

        current_img = current_img.resize((new_w, new_h), Image.LANCZOS)
        current_quality = initial_quality  # reset quality attempts after resizing
        print(f"Downscaled to {new_w}x{new_h} and retrying (reset quality to {initial_quality})")

    # Final attempt: save at min_quality even if still > limit (to leave something)
    try:
        current_img.save(output_path, format="JPEG", quality=min_quality, **jpeg_opts_extra)
        final_size = os.path.getsize(output_path)
        print(f"Final saved at min_quality={min_quality}: {(final_size/(1024*1024)):.2f} MB")
        return final_size <= max_bytes
    except Exception as e:
        print(f"Failed to save final JPEG: {e}")
        return False


def main():
    if len(sys.argv) >= 3:
        inp = sys.argv[1]
        out = sys.argv[2]
    else:
        inp = "input.arw"
        out = "output.jpg"

    success = arw_to_jpg_max_output(inp, out, max_output_mb=5.0)

    if success:
        print("Conversion succeeded and output is within size limit.")
    else:
        print("Conversion finished but could not reach the size limit (see messages above).")


if __name__ == "__main__":
    main()
