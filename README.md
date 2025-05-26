# 🧠 MongoDB to SQL Translator

A simple CLI tool that parses MongoDB `find()` queries and outputs the equivalent SQL query.

---

## 📦 Setup

Install dependencies:

```bash
npm install
```

---

## 🚀 Run

Start in development mode (with auto-reload):

```bash
npm run dev
```

Start in production mode:

```bash
npm run prod
```

---

## 🕹 Usage

Once running, type a MongoDB query like:

```
db.user.find({ name: 'john', age: { $gte: 18 } }, { name: 1, age: 1 })
```

And you'll get the corresponding SQL query:

```
SELECT name, age FROM user WHERE name = 'john' AND age >= 18
```

Type `"exit"` to quit the program.

---

## 🤹‍♂️ Bonus Feature

Every 3 queries, you'll get a fun surprise in the console 😄
