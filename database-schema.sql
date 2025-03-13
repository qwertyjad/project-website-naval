-- Create database
CREATE DATABASE IF NOT EXISTS construction_inventory;
USE construction_inventory;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'User',
  two_factor_enabled TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  min_stock_level INT NOT NULL DEFAULT 5,
  location VARCHAR(100),
  supplier VARCHAR(100),
  cost DECIMAL(10, 2) DEFAULT 0.00,
  description TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Purchase orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  po_number VARCHAR(20) NOT NULL,
  supplier VARCHAR(100) NOT NULL,
  order_date DATETIME NOT NULL,
  delivery_date DATETIME,
  delivery_address VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total_items INT NOT NULL DEFAULT 0,
  total_value DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Purchase order items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  unit VARCHAR(20) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);

-- Insert sample data

-- Default admin user
INSERT INTO users (full_name, email, password, company_name, role)
VALUES ('John Contractor', 'admin@example.com', 'password123', 'ABC Construction', 'Admin');

-- Sample inventory items
INSERT INTO inventory_items (name, category, quantity, unit, min_stock_level, location, supplier, cost, description)
VALUES 
('Cement', 'Building Materials', 150, 'Bags', 50, 'Warehouse A', 'ABC Suppliers', 12.99, 'Standard Portland cement'),
('Steel Rebar', 'Structural Materials', 30, 'Tons', 40, 'Warehouse B', 'Steel Works Inc.', 850.00, '10mm reinforcement bars'),
('Bricks', 'Building Materials', 2500, 'Pieces', 1000, 'Warehouse A', 'Brick Factory Ltd.', 0.75, 'Standard red clay bricks'),
('Paint - White', 'Finishing Materials', 0, 'Gallons', 20, 'Warehouse C', 'Paint Supplies Co.', 25.50, 'Interior latex paint'),
('Plywood', 'Wood Materials', 75, 'Sheets', 30, 'Warehouse B', 'Lumber Yard Co.', 35.25, '4x8 sheets, 3/4 inch thickness'),
('Concrete Mixer', 'Equipment', 3, 'Units', 2, 'Equipment Yard', 'Heavy Machinery Inc.', 1200.00, '9 cubic feet capacity'),
('Safety Helmets', 'Safety Equipment', 15, 'Pieces', 20, 'Storage Room', 'Safety First Ltd.', 18.75, 'OSHA approved hard hats'),
('Electrical Wires', 'Electrical Materials', 500, 'Meters', 200, 'Warehouse C', 'Electric Supply Co.', 2.25, '12-gauge copper wiring'),
('PVC Pipes', 'Plumbing Materials', 120, 'Pieces', 50, 'Warehouse A', 'Plumbing Depot', 8.50, '2-inch diameter, 10ft length'),
('Excavator', 'Heavy Equipment', 0, 'Units', 1, 'Equipment Yard', 'Heavy Machinery Inc.', 75000.00, 'Mini excavator, 5-ton capacity');

-- Sample purchase orders
INSERT INTO purchase_orders (po_number, supplier, order_date, delivery_date, delivery_address, status, total_items, total_value, notes)
VALUES 
('PO-2023-001', 'ABC Construction Supplies', '2023-05-15', '2023-05-22', '123 Construction Site, Building A', 'delivered', 15, 2500.00, 'Regular monthly order'),
('PO-2023-002', 'Steel Works Inc.', '2023-05-18', NULL, '123 Construction Site, Building B', 'pending', 8, 4200.00, 'Urgent order for project completion'),
('PO-2023-003', 'Concrete Solutions', '2023-05-20', NULL, '456 Commerce Dr', 'approved', 12, 1800.00, 'Foundation materials'),
('PO-2023-004', 'Hardware Depot', '2023-05-22', '2023-05-30', '789 Site Office', 'shipped', 25, 3200.00, 'Tools and hardware supplies'),
('PO-2023-005', 'Lumber Yard Co.', '2023-05-10', NULL, '101 Construction Ave', 'cancelled', 10, 1500.00, 'Order cancelled due to project delay');

-- Sample purchase order items
INSERT INTO purchase_order_items (order_id, item_name, quantity, unit, price)
VALUES 
(1, 'Cement', 50, 'Bags', 12.99),
(1, 'Bricks', 1000, 'Pieces', 0.75),
(2, 'Steel Rebar', 5, 'Tons', 840.00),
(3, 'Concrete Mix', 100, 'Bags', 18.00),
(4, 'Hammers', 10, 'Pieces', 25.00),
(4, 'Screwdrivers', 15, 'Pieces', 15.00),
(5, 'Plywood', 50, 'Sheets', 30.00);
