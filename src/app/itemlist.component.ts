import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, Item, TodoItem, TodoList } from '../db/db';

@Component({
  selector: 'itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css'],
})
export class ItemListComponent {
  @Input() todoList: TodoList;
  // Observe an arbritary query:
  todoItems$ = liveQuery(() => this.listTodoItems());

  async listTodoItems() {
    return await db.todoItems
      .where({
        todoListId: this.todoList.id,
      })
      .toArray();
  }

  async addItem() {
    await db.todoItems.add({
      title: this.itemName,
      todoListId: this.todoList.id,
    });
  }

  itemName = 'My new item';
}
