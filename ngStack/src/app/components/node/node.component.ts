import { Nodes } from './../../models/node';
import { NodeService } from '../../services/node.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FunctionService } from '../../services/function.service';
import { Function } from '../../models/function';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Technology } from '../../models/technology';
import { TechnologyService } from '../../services/technology.service';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './node.component.html',
  styleUrl: './node.component.css',
})
export class NodeComponent implements OnInit {
  //Fields
  node: Nodes = new Nodes();
  editNode: Nodes = new Nodes();
  functions: Function[] = [];
  members: User[] = [];
  userIsMember = false;
  userIsOwner = false;
  closeResult = '';
  nodeEditErrorText = '';
  technologies: Technology[] = [];

  //constructor
  constructor(
    private auth: AuthService,
    private techService: TechnologyService,
    private modalService: NgbModal,
    private nodeService: NodeService,
    private funcService: FunctionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  //lifecycle
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (map) => {
        const id = map.get('id');
        if (id) {
          const parse = parseInt(id) | 0;
          this.refreshNode(parse);
        }
      },
    });
  }

  //methods
  refreshNode(id: number) {
    this.nodeService.findById(id).subscribe({
      next: (node) => {
        this.node = node;
        this.refreshFunctions(id);
        this.refreshNodeMembers(id);
        this.auth.getLoggedInUser().subscribe({
          next: (currentUser) => {
            this.userIsOwner = currentUser.id === this.node.user.id;
          },
        });
      },
      error: () => {
        this.router.navigateByUrl('/404');
      },
    });
  }

  refreshNodeMembers(nodeId: number) {
    this.nodeService.getAllUsersInNode(nodeId).subscribe({
      next: (users: User[]) => {
        this.members = users;
        this.auth.getLoggedInUser().subscribe({
          next: (currentUser: User) => {
            if (currentUser) {
              this.userIsMember = this.members
                .map((item) => item.id)
                .includes(currentUser.id);
            }
          },
        });
      },
    });
  }

  refreshFunctions(id: number) {
    this.funcService.getFunctions(id).subscribe({
      next: (value: Function[]) => {
        this.functions = value;
      },
    });
  }

  openEditModal(content: TemplateRef<any>) {
    this.editNode = Object.assign({}, this.node);

    this.techService.showAll().subscribe({
      next: (technologies: Technology[]) => {
        const stackIds = this.editNode.stack.map((item) => item.id);
        this.technologies = technologies.filter(
          (tech) => !stackIds.includes(tech.id)
        );
      },
    });

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  submitNodeEdit() {
    this.nodeService.updateNode(this.node.id, this.editNode).subscribe({
      next: (node: Nodes) => {
        this.modalService.dismissAll('Save click');
        console.log(node);
        this.refreshNode(node.id);
      },
      error: (err: any) => {
        this.nodeEditErrorText = 'Your edit is invalid';
      },
    });
  }

  submitNodeDelete() {
    this.nodeService.deleteNode(this.node.id).subscribe({
      next: () => {
        localStorage.setItem('popup-message', 'Your node has been deleted');
        this.router.navigateByUrl('/home');
      },
    });
  }

  leaveGroup() {
    this.nodeService.leaveNode(this.node.id).subscribe({
      next: () => {
        this.refreshNodeMembers(this.node.id);
      },
    });
  }

  joinGroup() {
    this.nodeService.joinNode(this.node.id).subscribe({
      next: () => {
        this.refreshNodeMembers(this.node.id);
      },
    });
  }

  pushToStack(tech: Technology) {
    if (!this.editNode.stack.includes(tech)) {
      this.editNode.stack.push(tech);
      this.technologies = this.technologies.filter(
        (item: Technology) => item !== tech
      );
    }
  }

  popFromStack(tech: Technology) {
    if (this.editNode.stack.includes(tech)) {
      this.editNode.stack = this.editNode.stack.filter(
        (item) => item !== tech
      );
      this.technologies.push(tech);
    }
  }

  redirect(id: number){
    this.router.navigateByUrl("nodes/" + this.node.id + "/function/" +id)
  }
}
