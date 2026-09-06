# Мапа Believe / Bluff

Спільна мапа фронтенду й бекенду: [believe-back/PROJECT_MAP.md](../believe-back/PROJECT_MAP.md).

Вона містить призначення файлів, потік даних, події Socket.IO, запуск, таблицю «що змінювати — де шукати» та відомі розбіжності. Посилання передбачає, що обидва репозиторії лежать поруч.

Швидкі точки входу фронтенду:

- `app/page.tsx` → `components/Lobby.tsx` — головна сторінка та вхід.
- `app/room/[roomId]/page.tsx` — кімната і компонування гри.
- `store/useGameStore.ts` → `lib/socket.ts` — стан і зв’язок із сервером.
- `types/game.ts` — типи ігрових даних.
- `components/GameTable.tsx`, `PlayerHand.tsx`, `ActionPanel.tsx`, `GameLog.tsx` — ігровий інтерфейс.
- `app/globals.css` — глобальне оформлення.

Перед зміною коду читати [AGENTS.md](AGENTS.md). При зміні структури оновлювати спільну мапу.

## Акаунти — власна авторизація

- `app/(auth)/login/page.tsx`, `register/page.tsx` — вхід/реєстрація, редірект користувачів із дійсною сесією.
- `components/auth/AuthForm.tsx` — форми, pending, помилки та запити до API.
- `app/api/auth/[action]/route.ts` — перевірка Origin, розміру JSON, передавання запитів бекенду та HttpOnly cookie; сирий токен не повертається браузеру в JSON.
- `lib/auth/session.ts` — серверна перевірка акаунта, AUTH_BACKEND_URL, bluff_session cookie.
- `lib/auth/routes.ts` — безпечний локальний next і збереження запрошення.
- `proxy.ts` — попередня перевірка cookie для /account/*; остаточна перевірка сесії в account layout/page.
- `app/account/layout.tsx`, `page.tsx` — захищений акаунт і стан недоступності сервера.
- `components/auth/LogoutButton.tsx` — вихід із відкликанням сесії.
- `/` та `/room/*` залишаються публічними. Аватар/редагування/статистика ще не підключені.
- Налаштування, межі поточного етапу та тести: [AUTH_SETUP.md](../believe-back/AUTH_SETUP.md).
