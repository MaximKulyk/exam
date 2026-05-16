/**
 * Паттерн Итератор (Iterator)
 * * Назначение: Предоставляет способ последовательного обхода элементов 
 * агрегированного объекта (коллекции) без раскрытия его внутреннего представления.
 */

// Переименовали в IIterator, чтобы избежать конфликта со встроенным типом TypeScript
interface IIterator<T> {
    current(): T;
    next(): T;
    key(): number;
    valid(): boolean;
    rewind(): void;
}

// Интерфейс Агрегатора (Коллекции) определяет метод для получения итератора.
interface Aggregator {
    getIterator(): IIterator<string>;
}

// Конкретный Итератор реализует алгоритмы обхода коллекции.
class AlphabeticalOrderIterator implements IIterator<string> {
    private collection: WordsCollection;
    private position: number = 0;
    private reverse: boolean = false;

    constructor(collection: WordsCollection, reverse: boolean = false) {
        this.collection = collection;
        this.reverse = reverse;

        if (reverse) {
            this.position = collection.getCount() - 1;
        }
    }

    public rewind() {
        this.position = this.reverse ? this.collection.getCount() - 1 : 0;
    }

    public current(): string {
        return this.collection.getItems()[this.position];
    }

    public key(): number {
        return this.position;
    }

    public next(): string {
        const item = this.collection.getItems()[this.position];
        this.position += this.reverse ? -1 : 1;
        return item;
    }

    public valid(): boolean {
        if (this.reverse) {
            return this.position >= 0;
        }
        return this.position < this.collection.getCount();
    }
}

// Конкретная Коллекция предоставляет методы для получения итераторов,
// совместимых с классом коллекции.
class WordsCollection implements Aggregator {
    private items: string[] = [];

    public getItems(): string[] {
        return this.items;
    }

    public getCount(): number {
        return this.items.length;
    }

    public addItem(item: string): void {
        this.items.push(item);
    }

    // Возвращает стандартный итератор
    public getIterator(): IIterator<string> {
        return new AlphabeticalOrderIterator(this);
    }

    // Возвращает итератор с обратным обходом
    public getReverseIterator(): IIterator<string> {
        return new AlphabeticalOrderIterator(this, true);
    }
}

// === Демонстрация работы ===
const collection = new WordsCollection();
collection.addItem("Alpha");
collection.addItem("Bravo");
collection.addItem("Charlie");

console.log("Прямой обход коллекции:");
const iterator = collection.getIterator();
while (iterator.valid()) {
    console.log(iterator.next());
}

console.log("\nОбратный обход коллекции:");
const reverseIterator = collection.getReverseIterator();
while (reverseIterator.valid()) {
    console.log(reverseIterator.next());
}