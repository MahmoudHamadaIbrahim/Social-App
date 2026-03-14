import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from './service/profile.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly route = inject(ActivatedRoute);

  userData: any = {};
  isLoading: boolean = true;
  currentUserId: string | null = null;
  postList: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentUserId = params.get('id');

      if (!this.currentUserId) {
        const savedUser = localStorage.getItem('socialUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          this.currentUserId = parsedUser._id;
        }
      }

      if (this.currentUserId) {
        this.getProfileData(this.currentUserId);
        this.getUserPosts(this.currentUserId);
      } else {
        this.isLoading = false;
      }
    });
  }

  getProfileData(userId: string): void {
    this.profileService.getUserProfile(userId).subscribe({
      next: (res) => {
        this.userData = res.data?.user || res.data || res.user || res;

        this.userData.followersCount = this.userData?.followers?.length || 0;
        this.userData.followingCount = this.userData?.following?.length || 0;
        this.userData.bookmarksCount = this.userData?.bookmarks?.length || 0;
      },
    });
  }

  getUserPosts(userId: string): void {
    this.isLoading = true;
    this.profileService.getUserPosts(userId).subscribe({
      next: (res) => {
        let allPosts: any[] = [];
        if (res.data?.posts) {
          allPosts = res.data.posts;
        }

        this.postList = allPosts.filter((post) => {
          const hasBody =
            post.body !== null && post.body !== undefined && post.body.toString().trim() !== '';
          const hasImage =
            post.image !== null && post.image !== undefined && post.image.toString().trim() !== '';

          return hasBody || hasImage;
        });

        this.userData.postsCount = this.postList.length;

        this.isLoading = false;
      },
    });
  }

  uploadImage(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.userData) {
          this.userData.photo = e.target.result;
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('photo', file);

      this.profileService.uploadProfileImage(formData).subscribe({
        next: (res) => {
          if (res.user?.photo) {
            this.userData.photo = res.user.photo;
          }
        },
      });
    }
  }
}
