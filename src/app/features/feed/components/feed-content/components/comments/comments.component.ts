import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Comment } from './models/comment.interface';
import { CommentsService } from './service/comments.service';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  currentUser: any = JSON.parse(localStorage.getItem('socialUser')!);
  content: FormControl = new FormControl('');
  isSectionVisible: boolean = false;
  showAllComments: boolean = false;
  @Input() postId: string = '';
  userName: string = '';
  userImage: string = '';
  saveFile: File | null = null;
  @Output() countChanged = new EventEmitter<number>();
  imgUrl: string | ArrayBuffer | null | undefined;

  commentsList: Comment[] = [];

  ngOnInit(): void {
    this.getComment();
  }
  activeCommentMenuId: string | null = null;
  activeMenuId: string | null = null;

  toggleMenu(id: string) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  editReply(reply: any) {
    this.activeCommentId = reply.commentId;
    this.replyContent.setValue(reply.content);
    this.isEditMode = true;
    this.activeMenuId = null;
  }

  getReplies(commentId: string) {
    this.commentsService.getReplies(this.postId, commentId).subscribe({
      next: (res: any) => {
        console.log('Replies received:', res);

        const incomingReplies = res.replies;
        this.repliesMap[commentId] = incomingReplies;
      },
    });
  }

  submitReply(commentId: string): void {
    const contentValue = this.replyContent.value;

    if (!contentValue || contentValue.trim() === '') return;

    const formData = new FormData();
    formData.append('content', contentValue);

    this.commentsService.createReply(this.postId, commentId, formData).subscribe({
      next: (res) => {
        if (!this.repliesMap[commentId]) {
          this.repliesMap[commentId] = [];
        }
        this.replyContent.reset();
        this.getReplies(commentId);
      },
    });
  }

  replyContent = new FormControl('');
  activeCommentId: string | null = null;
  repliesMap: { [key: string]: any[] } = {};

  toggleReplyInput(commentId: string): void {
    this.activeCommentId = this.activeCommentId === commentId ? null : commentId;

    const comment = this.commentsList.find((c) => c._id === commentId);
    const username = comment?.commentCreator?.username || 'user';

    if (this.activeCommentId) {
      this.getReplies(commentId);
    }
  }

  changeImg(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.saveFile = input.files[0];

      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.saveFile);
      fileReader.onload = (e) => {
        if (e.target?.result) {
          this.imgUrl = e.target?.result;
        }
      };
      input.value = '';
    }
  }

  isEditMode: boolean = false;
  commentIdToEdit: string | null = null;
  selectedPostId: string | null = null;
  commentContent: string = '';

  deleteComment(postId: string, commentId: string): void {
    this.commentsService.deleteComment(postId, commentId).subscribe({
      next: (res) => {
        this.commentsList = this.commentsList.filter((c) => c._id !== commentId);
        this.activeCommentMenuId = null;
        this.getComment();
      },
    });
  }

  sendComment(e: Event): void {
    e.preventDefault();

    if (this.isEditMode) {
      this.updateExistingComment();
    } else {
      this.addComment(e);
    }
  }

  updateExistingComment(): void {
    this.commentsService
      .updateComment(this.selectedPostId!, this.commentIdToEdit!, this.content.value)
      .subscribe({
        next: (res) => {
          this.getComment();
          this.resetCommentForm();
        },
      });
  }

  startEditComment(comment: any, postId: string): void {
    this.isEditMode = true;
    this.commentIdToEdit = comment._id;
    this.selectedPostId = postId;

    this.content.setValue(comment.content);
    this.activeCommentMenuId = null;
  }

  resetCommentForm() {
    this.content.reset();
    this.isEditMode = false;
    this.commentIdToEdit = null;
    this.commentContent = '';
    this.selectedPostId = null;
  }

  removeImg(): void {
    this.imgUrl = '';
    this.saveFile = null;
  }

  addComment(e: Event): void {
    e.preventDefault();
    const formData = new FormData();

    if (this.content.value) {
      formData.append('content', this.content.value);
    }
    if (this.saveFile) {
      formData.append('image', this.saveFile);
    }

    this.commentsService.createComment(this.postId, formData).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getComment();
          this.resetForm();
          this.showAllComments = true;
        }
      },
    });
  }

  resetForm(): void {
    this.content.reset();
    this.imgUrl = null;
    this.saveFile = null;
  }

  getComment(): void {
    this.commentsService.getComment(this.postId).subscribe({
      next: (res) => {
        this.commentsList = res.data.comments;
      },
    });
  }
}
