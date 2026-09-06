import type { Locale } from './i18n';

export type RuleStep = { title: string; body: string; tip: string };
export const rules: Record<Locale, { title: string; open: string; close: string; next: string; back: string; done: string; step: string; steps: RuleStep[] }> = {
  uk: {
    title: 'Як грати в BLUFF', open: 'Правила гри', close: 'Закрити правила', next: 'Далі', back: 'Назад', done: 'Зрозуміло!', step: 'Крок',
    steps: [
      { title: 'Збери друзів за столом', body: 'Створи кімнату й надішли друзям посилання або код. Для старту потрібно щонайменше двоє. Можна грати гостем — акаунт не обов’язковий.', tip: 'Мета — позбутися всіх карт. Колода з 52 карт роздається між гравцями.' },
      { title: 'Зроби хід — чесно або з блефом', body: 'У свій хід вибери від 1 до 4 карт. Якщо стіл порожній, вибери заявлений ранг, наприклад Q. Карти лягають сорочкою догори: вони можуть бути дамами, а можуть і не бути.', tip: 'Ранг — це значення карти: 2–10, J, Q, K або A. Масть не впливає на правдивість ходу.' },
      { title: 'Докинь карти або оціни останній хід', body: 'Наступний гравець може додати 1–4 карти під той самий заявлений ранг. Або натиснути «Вірю» чи «Не вірю». Ранг не змінюється, доки стіл не очиститься.', tip: 'Під час оцінки перевіряються тільки карти останнього ходу, але забрати можна весь стіл.' },
      { title: '«Вірю» та «Не вірю»', body: 'Вірю + правда → весь стіл іде у відбій. Вірю + блеф → ти забираєш весь стіл. Не вірю + блеф → весь стіл забирає автор останнього ходу. Не вірю + правда → весь стіл забираєш ти.', tip: 'Якщо ти вгадав, наступний хід твій. Якщо помилився — хід переходить далі. Після оцінки починається нова стопка.' },
      { title: 'Чотири однакові — у відбій', body: 'Коли стіл порожній і зараз твій хід, вибери рівно 4 карти одного рангу та натисни «Скинути сет». Вони йдуть у відбій і більше не повертаються в гру.', tip: 'Якщо в руці ще є карти, після скидання сету ти ходиш знову.' },
      { title: 'Позбудься карт і займи своє місце', body: 'Якщо виклав останні карти, дочекайся оцінки: через викритий блеф вони можуть повернутися. Порожня рука після оцінки або скидання сету означає завершення для тебе.', tip: 'Перший, хто завершив, перемагає. Решта продовжують, доки не залишиться один гравець із картами. Потім можна почати нове коло.' },
    ],
  },
  pl: {
    title: 'Jak grać w BLUFF', open: 'Zasady gry', close: 'Zamknij zasady', next: 'Dalej', back: 'Wstecz', done: 'Rozumiem!', step: 'Krok',
    steps: [
      { title: 'Zaproś znajomych do stołu', body: 'Utwórz pokój i wyślij znajomym link lub kod. Potrzeba co najmniej dwóch graczy. Można grać jako gość, bez konta.', tip: 'Celem jest pozbycie się wszystkich kart. Talia 52 kart zostaje rozdana między graczy.' },
      { title: 'Zagraj uczciwie lub blefuj', body: 'W swoim ruchu wybierz od 1 do 4 kart. Jeśli stół jest pusty, zadeklaruj wartość, np. Q. Karty kładziesz zakryte: mogą to być damy, ale nie muszą.', tip: 'Wartości kart to 2–10, J, Q, K i A. Kolor nie wpływa na prawdziwość deklaracji.' },
      { title: 'Dołóż karty lub oceń ostatni ruch', body: 'Następny gracz może dołożyć 1–4 karty z tą samą deklarowaną wartością albo wybrać „Wierzę” lub „Nie wierzę”. Deklaracja pozostaje, dopóki stół nie zostanie opróżniony.', tip: 'Sprawdzane są tylko karty z ostatniego ruchu, ale kara dotyczy całego stosu.' },
      { title: '„Wierzę” i „Nie wierzę”', body: 'Wierzę + prawda → cały stos trafia do odrzuconych. Wierzę + blef → bierzesz cały stos. Nie wierzę + blef → stos bierze autor ostatniego ruchu. Nie wierzę + prawda → bierzesz stos.', tip: 'Jeśli masz rację, wykonujesz następny ruch. Jeśli się mylisz, kolejka przechodzi dalej. Po ocenie zaczyna się nowy stos.' },
      { title: 'Cztery takie same — odrzuć zestaw', body: 'Gdy stół jest pusty i jest Twój ruch, wybierz dokładnie 4 karty tej samej wartości i kliknij „Odrzuć zestaw”. Te karty nie wracają już do gry.', tip: 'Jeśli masz jeszcze karty, po odrzuceniu zestawu grasz ponownie.' },
      { title: 'Pozbądź się kart i zajmij miejsce', body: 'Po zagraniu ostatnich kart poczekaj na ocenę: wykryty blef może sprawić, że wrócą. Pusta ręka po ocenie lub odrzuceniu zestawu oznacza, że kończysz grę.', tip: 'Pierwszy gracz, który skończy, wygrywa. Pozostali grają, aż tylko jedna osoba ma karty. Potem można rozpocząć nową rundę.' },
    ],
  },
  en: {
    title: 'How to play BLUFF', open: 'Game rules', close: 'Close rules', next: 'Next', back: 'Back', done: 'Got it!', step: 'Step',
    steps: [
      { title: 'Bring your friends to the table', body: 'Create a room and share its link or code. You need at least two players. Everyone can play as a guest, without an account.', tip: 'Your goal is to get rid of all your cards. A 52-card deck is dealt among the players.' },
      { title: 'Play honestly — or bluff', body: 'On your turn, select 1–4 cards. If the table is empty, claim a rank, such as Q. Your cards are placed face down: they might be queens, or they might not.', tip: 'Ranks are 2–10, J, Q, K and A. Suits do not affect whether a claim is true.' },
      { title: 'Add cards or judge the last play', body: 'The next player can add 1–4 cards under the same claimed rank, or choose “Believe” or “Call bluff”. The rank stays the same until the table is cleared.', tip: 'Only the cards from the last play are checked, but the penalty involves the entire pile.' },
      { title: '“Believe” and “Call bluff”', body: 'Believe + truth → the entire pile is discarded. Believe + bluff → you take the pile. Call bluff + bluff → the last player takes the pile. Call bluff + truth → you take the pile.', tip: 'If you are right, you take the next turn. If you are wrong, the turn passes on. Each judgement clears the table for a new pile.' },
      { title: 'Four of a kind — discard the set', body: 'When the table is empty and it is your turn, select exactly 4 cards of the same rank and choose “Discard set”. Those cards leave the game permanently.', tip: 'If you still have cards, you play again after discarding a set.' },
      { title: 'Empty your hand and claim your place', body: 'After playing your last cards, wait for a judgement: a caught bluff can bring them back. An empty hand after a judgement or discarding a set means you have finished.', tip: 'The first player to finish wins. The others keep playing until only one player has cards. Then you can start a new round.' },
    ],
  },
};
