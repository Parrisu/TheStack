import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Technology } from '../../models/technology';
import { TechnologyService } from '../../services/technology.service';
import { Nodes } from '../../models/node';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User = new User();
  techAdd: Technology | null = null;
  theStack: Technology[] = [];
  showStack: boolean = false;
  groups: Nodes[] = [];

  constructor(
    private auth: AuthService,
    private userServ: UserService,
    private techServ: TechnologyService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.reloadPage();
  }

  popOrPushTech(user: User, tech: Technology) {
    this.userServ.addOrRemoveTech(user.id, tech).subscribe({
      next: (user) => {
        console.log(user);
        this.reloadPage();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadUserInfo() {
    this.auth.getLoggedInUser().subscribe({
      next: (user) => {
        this.user = user;
        console.log(this.user)
        this.loadStackInfo();

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadStackInfo() {
    this.techServ.showAll().subscribe({
      next: (techs) => {
        this.theStack = techs;
        this.stackCheck();
      },
      error: (errors) => {
        console.log(errors);
      },
    });
  }

  show() {
    this.showStack = !this.showStack;
  }

  stackCheck() {
    for (let i = 0; i < this.user.stack.length; i++) {
      for (let j = 0; j < this.theStack.length; j++) {
        if (this.user.stack[i].id == this.theStack[j].id)
          this.theStack.splice(j--, 1);
      }
    }
    this.getGroups();
  }

  getGroups(){
    this.userServ.getGroups(this.user.id).subscribe(
      {
        next: (nodes)=>{
          this.groups = nodes;
          console.log("groups =============");
          console.log({nodes})
        },
        error: (errors)=>{
          console.log(errors);
        }
      }
    )
  }

  redirect(id: number){
    this.router.navigateByUrl('nodes/'+id)

  }


  reloadPage() {
    this.loadUserInfo();

  }
}
