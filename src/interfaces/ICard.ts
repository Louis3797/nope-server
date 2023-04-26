export default interface ICard {
  type: 'number' | 'joker' | 'reboot' | 'see-through' | 'selection';
  color:
    | 'red'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'red-yellow'
    | 'blue-green'
    | 'yellow-blue'
    | 'red-blue'
    | 'red-green'
    | 'yellow-green'
    | 'multi'
    | null; // null for action cards or joker
  value: 1 | 2 | 3 | null; // null for action cards or joker
  select: 1 | -1 | null; // is only not null if the selection card is played
  selectValue: 1 | 2 | 3 | null;
  selectedColor: 'red' | 'blue' | 'green' | 'yellow' | null;
}
