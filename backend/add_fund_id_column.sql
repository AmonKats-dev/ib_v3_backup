-- SQL script to add fund_id column to fund_source table
-- Run this script directly on your database if migration doesn't work

-- Check if column exists and add it if it doesn't
-- For MySQL/MariaDB:
ALTER TABLE fund_source 
ADD COLUMN IF NOT EXISTS fund_id INT NULL;

-- For databases that don't support IF NOT EXISTS, use this instead:
-- ALTER TABLE fund_source ADD COLUMN fund_id INT NULL;

-- Add foreign key constraint
ALTER TABLE fund_source 
ADD CONSTRAINT fund_source_fund_fk 
FOREIGN KEY (fund_id) REFERENCES fund(id);

-- Note: If the column already exists, you may get an error. 
-- In that case, just run the foreign key constraint part:
-- ALTER TABLE fund_source 
-- ADD CONSTRAINT fund_source_fund_fk 
-- FOREIGN KEY (fund_id) REFERENCES fund(id);






