import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Angular CDK Drag & Drop
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

// Dialog + Service
import { AddTaskDialogComponent } from '../../shared/add-task-dialog/add-task-dialog.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  // Columns (kept as any[] to match your existing service)
  todo: any[] = [];
  inProgress: any[] = [];
  done: any[] = [];

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService
  ) {}

  // Load tasks when the component loads
  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.todo = tasks.filter((t: any) => t.status === 'todo');
      this.inProgress = tasks.filter((t: any) => t.status === 'in-progress');
      this.done = tasks.filter((t: any) => t.status === 'done');
    });
  }

  // Drag & drop handler
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];

      const newStatus =
        event.container.id === 'todoList' ? 'todo' :
        event.container.id === 'progressList' ? 'in-progress' :
        'done';

      // Update backend
      this.taskService.updateTask(item._id, { status: newStatus }).subscribe();

      // Move in UI
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      item.status = newStatus;
    }
  }

  // Open Add Task dialog
  openAddTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.trim() !== '') {
        this.taskService.addTask(result).subscribe(task => {
          this.todo.push(task); // task returned from backend
        });
      }
    });
  }

  // ✅ Delete task (UI + backend)
  deleteTask(column: 'todo' | 'inProgress' | 'done', index: number, task: any) {
    // If you don’t have this yet, add deleteTask(id) in TaskService
    this.taskService.deleteTask(task._id).subscribe(() => {
      if (column === 'todo') {
        this.todo.splice(index, 1);
      } else if (column === 'inProgress') {
        this.inProgress.splice(index, 1);
      } else {
        this.done.splice(index, 1);
      }
    });
  }
}
