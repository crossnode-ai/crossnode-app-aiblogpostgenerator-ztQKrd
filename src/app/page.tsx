"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the structure of a blog post
interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'approved' | 'rejected' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// Mock API functions (replace with actual API calls)
const mockApi = {
  getDraftPost: async (agentId: string): Promise<BlogPost | null> => {
    console.log(`Mock API: Fetching draft post for agentId: ${agentId}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (agentId === 'pending') {
      return null;
    }

    const now = new Date();
    return {
      id: 'post-123',
      title: 'The Future of AI Agents in Content Creation',
      content: `
        <h2>Introduction</h2>
        <p>Artificial intelligence agents are rapidly transforming the landscape of content creation. From drafting initial outlines to generating full articles, these sophisticated tools are becoming indispensable for marketers, writers, and businesses alike.</p>

        <h2>How AI Agents Work</h2>
        <p>AI agents leverage advanced natural language processing (NLP) and machine learning models to understand prompts, research topics, and synthesize information into coherent content. They can adapt to various writing styles and tones, making them versatile tools for diverse content needs.</p>

        <h2>Benefits of Using AI Agents</h2>
        <ul>
          <li>Increased efficiency and speed in content production.</li>
          <li>Enhanced creativity and idea generation.</li>
          <li>Improved consistency in brand voice and messaging.</li>
          <li>Cost-effectiveness for large-scale content projects.</li>
        </ul>

        <h2>Challenges and Considerations</h2>
        <p>Despite their advantages, AI agents also present challenges. Ensuring factual accuracy, maintaining originality, and avoiding biases are crucial. Human oversight remains essential to refine AI-generated content and ensure it aligns with strategic goals.</p>

        <h2>The Road Ahead</h2>
        <p>As AI technology continues to evolve, we can expect even more advanced capabilities from AI agents. Their integration into content workflows will likely deepen, leading to new possibilities and a redefined relationship between human creativity and artificial intelligence.</p>
      `,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
  },

  savePost: async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<BlogPost> => {
    console.log('Mock API: Saving post', post);
    await new Promise(resolve => setTimeout(resolve, 500));

    const now = new Date();
    const newPost: BlogPost = {
      id: post.id || `post-${Math.random().toString(36).substr(2, 9)}`,
      title: post.title,
      content: post.content,
      status: post.status,
      createdAt: post.id ? now : now, // If existing, keep original createdAt, otherwise set new
      updatedAt: now,
    };
    return newPost;
  },

  publishPost: async (postId: string): Promise<BlogPost> => {
    console.log(`Mock API: Publishing post ${postId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = new Date();
    return {
      id: postId,
      title: 'Published Post Title',
      content: 'This is the published content.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    };
  },

  approvePost: async (postId: string): Promise<BlogPost> => {
    console.log(`Mock API: Approving post ${postId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = new Date();
    return {
      id: postId,
      title: 'Approved Post Title',
      content: 'This is the approved content.',
      status: 'approved',
      createdAt: now,
      updatedAt: now,
    };
  },

  rejectPost: async (postId: string): Promise<BlogPost> => {
    console.log(`Mock API: Rejecting post ${postId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = new Date();
    return {
      id: postId,
      title: 'Rejected Post Title',
      content: 'This is the rejected content.',
      status: 'rejected',
      createdAt: now,
      updatedAt: now,
    };
  },
};

export default function EditorPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingContent, setEditingContent] = useState<string>('');
  const router = useRouter(); // Imported but not used, can be removed if not needed for navigation

  const fetchDraft = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPost = await mockApi.getDraftPost('agent-1'); // Example agentId
      if (fetchedPost) {
        setPost(fetchedPost);
        setEditingTitle(fetchedPost.title);
        setEditingContent(fetchedPost.content);
      } else {
        setPost(null);
        setEditingTitle('');
        setEditingContent('');
        toast.info('No draft post found for this agent.');
      }
    } catch (error) {
      console.error('Error fetching draft post:', error);
      toast.error('Failed to load draft post. Please try again later.');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  const handleSaveDraft = async () => {
    if (!post) return;
    try {
      const updatedPost = await mockApi.savePost({
        id: post.id,
        title: editingTitle,
        content: editingContent,
        status: 'draft',
      });
      setPost(updatedPost);
      toast.success('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft. Please check your connection and try again.');
    }
  };

  const handlePublish = async () => {
    if (!post) return;
    try {
      const publishedPost = await mockApi.publishPost(post.id);
      setPost(publishedPost);
      toast.success('Post published successfully!');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('Failed to publish post. Please try again.');
    }
  };

  const handleApprove = async () => {
    if (!post) return;
    try {
      const approvedPost = await mockApi.approvePost(post.id);
      setPost(approvedPost);
      toast.success('Post approved successfully!');
    } catch (error) {
      console.error('Error approving post:', error);
      toast.error('Failed to approve post. Please try again.');
    }
  };

  const handleReject = async () => {
    if (!post) return;
    try {
      const rejectedPost = await mockApi.rejectPost(post.id);
      setPost(rejectedPost);
      toast.success('Post rejected successfully!');
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast.error('Failed to reject post. Please try again.');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading post...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Blog Post Editor</h1>

      {post ? (
        <div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              aria-label="Edit blog post title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              aria-label="Edit blog post content"
            ></textarea>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSaveDraft}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Save draft"
            >
              Save Draft
            </button>
            {post.status === 'draft' && (
              <button
                onClick={handlePublish}
                className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Publish post"
              >
                Publish
              </button>
            )}
            {post.status === 'draft' && (
              <button
                onClick={handleApprove}
                className="inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                aria-label="Approve post"
              >
                Approve
              </button>
            )}
            {post.status === 'draft' && (
              <button
                onClick={handleReject}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Reject post"
              >
                Reject
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>No blog post available to edit.</p>
      )}
    </div>
  );
}