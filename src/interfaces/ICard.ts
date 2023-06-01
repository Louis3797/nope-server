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
    | 'multi';
  value: number | null; // null for action cards or joker
  select?: number | null; // is only not null if the selection card is played
  selectValue?: number | null;
  selectedColor?: 'red' | 'blue' | 'green' | 'yellow' | null;
}
