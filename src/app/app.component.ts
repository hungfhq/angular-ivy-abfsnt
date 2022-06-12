import { Component, VERSION } from '@angular/core';
import { liveQuery } from 'dexie';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { db, TodoItem, TodoList } from '../db/db';
import Thinker, {rankers} from 'thinker-fts';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todoLists$ = liveQuery(() => db.todoLists.toArray());
  listName = 'My new list';
  searchTerms = new Subject<string>();
  result$: Promise<TodoItem[]>;
  resultLength = 0;

  async addNewList() {
    await db.todoLists.add({
      title: this.listName,
    });
  }

  inputSearch(searchValue: string) {
    this.resultLength = 0;
    this.searchTerms.next(searchValue.trim());
    this.searchTerms
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((t: any) => {
        console.log(t);
        this.result$ = this.search(t);
        this.result$.then((result) => {
          this.resultLength = result.length;
        });
      });
  }

  async search(term: string) {
    let regEx =  new RegExp(term, 'g');
    return await db.todoItems
      .filter((todo) => regEx.test(todo.title))
      .toArray();
  }

  async resetDatabase() {
    await db.resetDatabase();
  }

  // inputSearch(term: string) {
  //   if (term.trim() == '') {
  //     this.result$ = null;
  //     return;
  //   } else {
  //     this.result$ = this.search(term);
  //   }
  // }

  identifyList(index: number, list: TodoList) {
    return `${list.id}${list.title}`;
  }

  const thinker = Thinker();
  thinker.ranker = rankers.standard();
}
