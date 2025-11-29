'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Mail, 
  MailOpen, 
  Trash2, 
  Calendar,
  User,
  Users,
  Phone,
  AtSign,
  MessageSquare,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Inquiry {
  _id: string;
  name: string;
  partner?: string;
  email: string;
  phone?: string;
  date?: string;
  story: string;
  status: 'read' | 'unread';
  createdAt: string;
}

interface Stats {
  total: number;
  unread: number;
  read: number;
}

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, read: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInquiries();
    loadStats();
  }, []);

  const loadInquiries = async (status?: 'read' | 'unread') => {
    try {
      setLoading(true);
      const response = await api.getInquiries(status);
      setInquiries(response.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load inquiries',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.getInquiryStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      loadInquiries();
    } else if (value === 'unread') {
      loadInquiries('unread');
    } else if (value === 'read') {
      loadInquiries('read');
    }
  };

  const toggleReadStatus = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === 'unread') {
        await api.markInquiryAsRead(id);
        toast({
          title: 'Success',
          description: 'Inquiry marked as read'
        });
      } else {
        await api.markInquiryAsUnread(id);
        toast({
          title: 'Success',
          description: 'Inquiry marked as unread'
        });
      }
      
      // Reload inquiries and stats
      handleTabChange(activeTab);
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update inquiry',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.deleteInquiry(deleteId);
      toast({
        title: 'Success',
        description: 'Inquiry deleted successfully'
      });
      
      // Reload inquiries and stats
      handleTabChange(activeTab);
      loadStats();
      setDeleteId(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete inquiry',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWeddingDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground mt-2">
          Manage wedding inquiries from potential clients
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Circle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.read}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries List */}
      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
          <CardDescription>View and manage wedding inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({stats.unread})</TabsTrigger>
              <TabsTrigger value="read">Read ({stats.read})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No inquiries found
                </div>
              ) : (
                inquiries.map((inquiry) => (
                  <Card key={inquiry._id} className={inquiry.status === 'unread' ? 'border-blue-200 bg-blue-50/50' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {inquiry.status === 'unread' ? (
                              <Mail className="h-5 w-5 text-blue-500" />
                            ) : (
                              <MailOpen className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{inquiry.name}</h3>
                              {inquiry.partner && (
                                <>
                                  <span className="text-muted-foreground">&</span>
                                  <span className="text-lg font-semibold">{inquiry.partner}</span>
                                </>
                              )}
                              <Badge variant={inquiry.status === 'unread' ? 'default' : 'secondary'}>
                                {inquiry.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <AtSign className="h-4 w-4" />
                                <a href={`mailto:${inquiry.email}`} className="hover:underline">
                                  {inquiry.email}
                                </a>
                              </div>
                              {inquiry.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  <a href={`tel:${inquiry.phone}`} className="hover:underline">
                                    {inquiry.phone}
                                  </a>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Wedding: {formatWeddingDate(inquiry.date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <MessageSquare className="h-4 w-4" />
                                <span>Received: {formatDate(inquiry.createdAt)}</span>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded p-3 text-sm">
                              <p className="font-medium mb-1">Their Story:</p>
                              <p className="text-muted-foreground whitespace-pre-wrap">{inquiry.story}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleReadStatus(inquiry._id, inquiry.status)}
                            title={inquiry.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
                          >
                            {inquiry.status === 'unread' ? (
                              <MailOpen className="h-4 w-4" />
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(inquiry._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete inquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inquiry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
