USE icspaces;

CREATE TABLE notifications(
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    notification_type INT NOT NULL,
    notification_action VARCHAR(50) NOT NULL,
    notification_body VARCHAR(255) NOT NULL,
    notification_date DATETIME DEFAULT NOW(),
    actor_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL 
);

