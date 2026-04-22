CREATE TABLE t_p36734692_tg_manager_clone.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(100) DEFAULT 'На связи 🚀',
    created_at TIMESTAMP DEFAULT NOW()
);
