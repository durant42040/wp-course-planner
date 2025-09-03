import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface Comment {
  id: string;
  text: string;
  timestamp: number;
}

interface CommentCardProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
}

export function CommentCard({ comment, onDelete }: CommentCardProps) {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm text-gray-500">
            {formatTimestamp(comment.timestamp)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(comment.id)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
      </CardContent>
    </Card>
  );
}
