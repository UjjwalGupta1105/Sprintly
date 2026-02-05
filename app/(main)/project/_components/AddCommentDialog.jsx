"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import MarkdownEditor from "@uiw/react-markdown-editor"
import { BarLoader } from "react-spinners"
import { useState } from "react"
import { createIsuueComment } from "@/app/actions/issues"
import { toast } from "sonner"

const AddCommentDialog = ({ open, onClose, issueId }) => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    setLoading(true)
    try {
      await createIsuueComment(issueId, content)
      toast.success("Comment added")
      setContent("")
      onClose()
    } catch (err) {
      toast.error(err.message || "Failed to add comment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>

        {loading && <BarLoader width="100%" color="#36d7b7" />}

        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="Write your comment…"
          className="rounded"
        />

        <div className="flex justify-end gap-2 mt-4 ">
          <Button variant="ghost" onClick={onClose} className={`cursor-pointer`}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={loading} className={`cursor-pointer`}>
            Add Comment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCommentDialog
