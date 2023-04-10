# Mitwirken am nope-server

- [Mitwirken am nope-server](#mitwirken-am-nope-server)
  - [Schnellstart](#schnellstart)
  - [Beiträge](#beiträge)
  - [Commit-Meldungen](#commit-meldungen)
  - [Tests](#tests)
  - [Coding Style](#coding-style)
    - [Namenskonventionen](#namenskonventionen)
    - [Const, Let, Var](#const-let-var)
    - [TypeScript](#typescript)
    - [Comments](#comments)
  - [ORM und Datenbank](#orm-und-datenbank)
  - [Paket-Manager](#paket-manager)

## Schnellstart

Um mit dem Projekt zu beginnen, befolgen Sie diese Schritte:

- Klonen Sie das Repository mit `git clone https://github.com/Louis3797/nope-server.git`.
- Installieren Sie die Abhängigkeiten mit yarn install.
- Erstellen Sie eine .env-Datei auf der Grundlage von .env.example und aktualisieren Sie die Werte mit Ihrer eigenen Konfiguration `cp .env.example .env`.
- Generieren sie mit `yarn husky install` Husky hooks.
- Führen Sie die Migrationen mit `yarn prisma migrate dev --name init` aus.
- Um den Prisma Client zu generieren führen sie nach der migration `yarn prisma:gen` aus.
- Starten Sie den Entwicklungsserver mit `yarn dev` in der Entwicklungsumgebung.
- Dies startet den Entwicklungsserver unter `http://localhost:<PORT>`
-

```bash
  git clone https://github.com/Louis3797/nope-server.git

  cd nope-server

  cp .env.example .env

  yarn install # install dependencies

  yarn husky install

  yarn prisma migrate dev --name init 

  yarn prisma:gen
```

Weitere infos findet man in der Readme.md unter der Sektion [Erste Schritte](https://github.com/Louis3797/nope-server#erste-schritte)

## Beiträge

Um zu diesem Projekt beizutragen, folgen Sie diesen Schritten:

- Forken Sie das Repository.
- Erstellen Sie eine neue Branch für Ihre Änderungen mit einem beschreibenden Prefix vor dem Namen, wie "feature/..." oder "bugfix/...", mit dem Befehl `git checkout -b <branch-name>`.
- Führen Sie Ihre Änderungen durch und stellen Sie sicher, dass Sie Tests für alle neuen Funktionen und Änderungen schreiben.
- Committen sie ihre Änderungen mit `git cz` oder `yarn cz`.
- Pushen Sie Ihre Änderungen in Ihren Fork: `git push -u origin <branch-name>`.
- Erstellen Sie einen Pull Request an das Haupt-Repository auf die `development branch`.

## Commit-Meldungen

Dieses Projekt verwendet Commitizen und Commitlint, um sicherzustellen, dass die Commit-Meldungen konsistent und informativ sind. Um Commitizen zu verwenden, um eine gut formatierte Commit-Meldung zu erstellen, führen Sie nach den Änderungen `git cz` oder `yarn cz` aus. Dies führt Sie durch das Erstellen einer Commit-Meldung im konventionellen Commit-Format. Die Commit-Meldungen sollten dem Format type(scope): message folgen, wobei type eine der folgenden Optionen ist: feat, fix, docs, style, refactor, test oder chore. scope ist optional, sollte aber den Bereich des Codes beschreiben, auf den sich die Änderung auswirkt. message sollte eine kurze Beschreibung der Änderung im Imperativ enthalten.

Nachdem Sie git cz oder yarn cz ausgeführt haben, prüft Commitlint, ob die Commit-Meldung dem konventionellen Commit-Format entspricht. Wenn die Commit-Meldung nicht bestanden wird, werden Sie aufgefordert, die Meldung zu korrigieren, bevor der Commit abgeschlossen werden kann.

Hier sind einige andere gängige Präfixe, die Sie bei der Benennung von Git-Zweigen verwenden können:

    - "fix/..." - Verwenden Sie diesen Präfix für Zweige, die zur Behebung von nicht kritischen Fehlern im Code verwendet werden.

    - "hotfix/..." - Verwenden Sie diesen Präfix für Zweige, mit denen kritische Fehler oder Sicherheitsprobleme im Code behoben werden.

    - "release/..." - Verwenden Sie diesen Präfix für Zweige, die für die Vorbereitung und das Testen einer neuen Version der Software verwendet werden.

    - "test/..." - Verwenden Sie diesen Präfix für Zweige, die zum Testen neuer Funktionen oder Änderungen verwendet werden.

    - "refactor/..." - Verwenden Sie diesen Präfix für Zweige, die für das Refactoring von bestehendem Code verwendet werden.

    - "chore/..." - Verwenden Sie diesen Präfix für Zweige, die für nicht-codierende Aufgaben verwendet werden, wie z.B. die Aktualisierung der Dokumentation oder die Konfiguration der Entwicklungsumgebung.

## Tests

Schreiben Sie Tests für alle neuen Funktionen und Änderungen mit Jest. Verwenden Sie eine einheitliche Namenskonvention für Ihre Testdateien und -funktionen, wie z.B. "file.spec.js" und "testFunction()". Verwenden Sie aussagekräftige Namen für Ihre Testfunktionen, die deutlich machen, was getestet wird und was das erwartete Ergebnis ist.

## Coding Style

Dieses Projekt verwendet ESLint und Prettier, um sicherzustellen, dass der Code konsistent formatiert und fehlerfrei ist. Verwenden Sie `yarn lint` und `yarn prettier:format` regelmäßig, um sicherzustellen, dass Ihr Code diesen Standards entspricht.

### Namenskonventionen

- Benennen Sie Variablen, Funktionen, Dateien, etc... auf Englisch.
- Verwenden Sie bei der Benennung von Variablen, Funktionen und Klassenattributen camelCase.
- Verwenden Sie bei der Benennung von Klassen, Schnittstellen und Typaliase PascalCase.
- Verwenden Sie UPPERCASE für Konstanten.

### Const, Let, Var

- Verwenden Sie let oder const anstelle von var.
- Verwenden Sie const anstelle von let, wann immer möglich, da dies Ihren Code lesbarer macht und versehentliches Überschreiben verhindert.

### TypeScript

- Verwenden Sie explizite Typen, um Ihren Code lesbarer und einfacher zu pflegen zu machen.
- Verwenden Sie Schnittstellen und Typ-Aliase, um komplexe Datenstrukturen zu definieren und Ihren Code modularer und wiederverwendbar zu machen.

### Comments

- Verfassen Sie Kommentare auf Englisch. 
- Verwenden Sie Codekommentare, um komplexe Logik oder Funktionen zu erklären.
- Kommentieren Sie jeden Code, der nicht sofort offensichtlich oder selbsterklärend ist.
- Vermeiden Sie Kommentare, die einfach wiederholen, was der Code tut. Konzentrieren Sie sich stattdessen darauf, zu erklären, warum der Code tut, was er tut.
- Halten Sie Ihre Kommentare auf dem neuesten Stand mit dem Code. Wenn Sie den Code ändern, aktualisieren Sie auch die Kommentare.


## ORM und Datenbank

Dieses Projekt verwendet Prisma als ORM und MySQL als Datenbank. Bevor Sie den Entwicklungsserver starten, stellen Sie sicher, dass Sie die Migrationen mit `yarn prisma migrate dev --name init` ausführen. Falls sie Änderungen an der Datei `schema.prisma` vornehmen sollten führen sie in `yarn prisma migrate dev --name <name>` aus und danach `yarn prisma:gen`.

## Paket-Manager

Dieses Projekt verwendet Yarn als Packet Manager. Um neue Pakete zu installieren oder vorhandene Pakete zu aktualisieren, verwenden Sie `yarn add <package-name>` oder `yarn upgrade <package-name>`.
