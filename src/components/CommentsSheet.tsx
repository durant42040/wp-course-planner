import { useState, useEffect } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { CommentCard } from "./CommentCard";

interface Comment {
  id: string;
  text: string;
  timestamp: number;
}

interface CommentsSheetProps {
  courseId: string;
  courseName: string;
}

export function CommentsSheet({ courseId, courseName }: CommentsSheetProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Load comments from localStorage when component mounts or courseId changes
  useEffect(() => {
    console.log(`comments_${courseId}`);
    const savedComments = localStorage.getItem(`comments_${courseId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments([]);
    }
  }, [isOpen]);

  // Save comments to localStorage whenever comments change
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments_${courseId}`, JSON.stringify(comments));
    }
  }, [comments]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        timestamp: Date.now(),
      };
      setComments(prev => [comment, ...prev]);
      setNewComment("");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-gray-200 h-6 w-6 p-0"
        >
          <MessageSquare className="h-3 w-3" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-white">
        <SheetHeader>
          <SheetTitle>Comments for {courseName}</SheetTitle>
          <SheetDescription>
            Add your thoughts and experiences about this course.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 px-4">
          {/* Add new comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Write your comment here..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>

          {/* Comments list */}
          <div className="space-y-3">
            {comments.length !== 0 &&
              comments.map(comment => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                />
              ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
