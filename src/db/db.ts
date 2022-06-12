import Dexie, { Table } from 'dexie';

export interface Item {
  id?: number;
  name: string;
}

export interface TodoList {
  id?: number;
  title: string;
}
export interface TodoItem {
  id?: number;
  todoListId: number;
  title: string;
  done?: boolean;
}

export class AppDB extends Dexie {
  todoItems!: Table<TodoItem, number>;
  todoLists!: Table<TodoList, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      todoLists: '++id',
      todoItems: '++id, todoListId',
    });
    this.on('populate', () => this.populate());
  }

  nouns = [
    'bird',
    'clock',
    'boy',
    'plastic',
    'duck',
    'teacher',
    'old lady',
    'professor',
    'hamster',
    'dog',
    'master',
    'guru',
    'player',
  ];
  verbs = [
    'kicked',
    'ran',
    'flew',
    'dodged',
    'sliced',
    'rolled',
    'died',
    'breathed',
    'slept',
    'killed',
  ];
  adjectives = [
    'beautiful',
    'lazy',
    'professional',
    'lovely',
    'dumb',
    'rough',
    'soft',
    'hot',
    'vibrating',
    'slimy',
  ];
  adverbs = [
    'slowly',
    'elegantly',
    'precisely',
    'quickly',
    'sadly',
    'humbly',
    'proudly',
    'shockingly',
    'calmly',
    'passionately',
  ];
  preposition = [
    'down',
    'into',
    'up',
    'on',
    'upon',
    'below',
    'above',
    'through',
    'across',
    'towards',
  ];

  sentence() {
    var rand1 = Math.floor(Math.random() * 10);

    var rand2 = Math.floor(Math.random() * this.nouns.length);
    var rand3 = Math.floor(Math.random() * 10);
    var rand4 = Math.floor(Math.random() * 10);
    var rand5 = Math.floor(Math.random() * 10);
    var rand6 = Math.floor(Math.random() * 10);
    //                var randCol = [rand1,rand2,rand3,rand4,rand5];
    //                var i = randGen();
    var content =
      'The ' +
      this.adjectives[rand1] +
      ' ' +
      this.nouns[rand2] +
      ' ' +
      this.adverbs[rand3] +
      ' ' +
      this.verbs[rand4] +
      ' because some ' +
      this.nouns[rand1] +
      ' ' +
      this.adverbs[rand1] +
      ' ' +
      this.verbs[rand1] +
      ' ' +
      this.preposition[rand1] +
      ' a ' +
      this.adjectives[rand2] +
      ' ' +
      this.nouns[rand5] +
      ' which, became a ' +
      this.adjectives[rand3] +
      ', ' +
      this.adjectives[rand4] +
      ' ' +
      this.nouns[rand6] +
      '.';

    return content;
  }

  sentencesArr = [];
  backup = [];

  async populate() {
    const todoListId = await db.todoLists.add({
      title: 'To Do Today',
    });
    for (let i = 0; i < 100; i++) {
      let t = this.sentence();
      this.sentencesArr.push({ todoListId, title: t });
      this.backup.push({ id: i, field: t });
    }
    await db.todoItems.bulkAdd(this.sentencesArr);
  }

  async resetDatabase() {
    await db.transaction('rw', 'todoItems', 'todoLists', () => {
      this.todoItems.clear();
      this.todoLists.clear();
      this.populate();
    });
  }
}

export const db = new AppDB();
