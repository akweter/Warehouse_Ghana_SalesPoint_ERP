
const DBTables =
    `
        CREATE TABLE IF NOT EXISTS company (
            Com_name varchar(70) DEFAULT NULL,
            Com_tin varchar(15) DEFAULT NULL,
            Com_address varchar(30) DEFAULT NULL,
            Com_phone varchar(15) DEFAULT NULL,
            Com_email varchar(35) DEFAULT NULL,
            Com_id varchar(20) PRIMARY KEY NOT NULL,
            Com_logo blob DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        
        CREATE TABLE IF NOT EXISTS customers (
            C_name varchar(70) DEFAULT NULL,
            C_tin varchar(15) DEFAULT NULL,
            C_address varchar(30) DEFAULT NULL,
            C_phone varchar(15) DEFAULT NULL,
            C_region enum('local','foreign') DEFAULT 'local',
            C_status enum('active','inactive') DEFAULT 'active',
            C_email varchar(35) DEFAULT NULL,
            C_exempted enum('Taxable','Exempted','') DEFAULT 'Taxable',
            C_rating int(11) DEFAULT NULL,
            C_id varchar(10) PRIMARY KEY NOT NULL,
            C_Added_date date NOT NULL DEFAULT current_timestamp()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS inventory (
            Itm_autoincrement int(11) NOT NULL,
            Itm_cat varchar(25) DEFAULT '""',
            Itm_name varchar(50) NOT NULL,
            Itm_status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
            Itm_img blob DEFAULT NULL,
            Itm_qty int(11) NOT NULL,
            Itm_price int(11) NOT NULL,
            Itm_sup_id varchar(50) NOT NULL DEFAULT '""',
            Itm_usr_id varchar(50) NOT NULL,
            Itm_taxable enum('CST','EXM','','TRSM') NOT NULL,
            itm_date date NOT NULL,
            Itm_id char(36) NOT NULL,
            Itm_UOM varchar(20) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS invoice (
            Inv_ID_auto int(15) NOT NULL,
            Inv_Check int(20) NOT NULL,
            Inv_user varchar(30) DEFAULT NULL,
            Inv_total_amt decimal(10,2) DEFAULT 0.00,
            Inv_status enum('Purchase','Invoice','Refund','Refund_Cancellation','Partial_Refund','Proforma Invoice') DEFAULT 'Proforma Invoice',
            Inv_Calc_Type varchar(20) DEFAULT 'INCLUSIVE',
            Inv_date date DEFAULT current_timestamp(),
            currency enum('GHS','USD','GBP','EUR') DEFAULT 'GHS',
            Inv_Sale_Type varchar(15) DEFAULT 'NORMAL',
            Inv_Number varchar(30) NOT NULL,
            Inv_Customer_Tin varchar(15) DEFAULT 'C0000000000',
            Inv_Cus_ID varchar(20) NOT NULL,
            Inv_discount decimal(10,2) DEFAULT 0.00,
            Inv_ext_Rate decimal(10,2) DEFAULT 0.00,
            Inv_vat decimal(10,2) DEFAULT 0.00,
            Inv_id varchar(36) NOT NULL DEFAULT current_timestamp(),
            Inv_Reference varchar(100) DEFAULT NULL,
            remarks text DEFAULT NULL,
            nhil decimal(10,2) DEFAULT 0.00,
            getfund decimal(10,2) DEFAULT 0.00,
            covid decimal(10,2) DEFAULT 0.00,
            cst decimal(10,2) DEFAULT 0.00,
            tourism decimal(10,2) DEFAULT 0.00,
            Inv_Discount_Type varchar(20) DEFAULT NULL,
            ysdcid varchar(20) DEFAULT NULL,
            ysdcrecnum varchar(32) DEFAULT NULL,
            ysdcintdata varchar(35) DEFAULT NULL,
            ysdcregsig varchar(25) DEFAULT NULL,
            ysdcmrc varchar(15) DEFAULT NULL,
            ysdcmrctim varchar(20) DEFAULT NULL,
            ysdctime varchar(20) DEFAULT NULL,
            qr_code text DEFAULT NULL,
            Inv_delivery_fee varchar(15) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS invoice_products (
            _ID varchar(26) PRIMARY KEY NOT NULL,
            InvoiceNum_ID varchar(25) NOT NULL,
            Product_ID varchar(36) NOT NULL,
            Product_Price decimal(10,2) NOT NULL,
            Product_Discount double(10,2) NOT NULL,
            Product_Quantity int(11) NOT NULL,
            Product_Refunded_Quantity int(11) NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS suppliers (
            S_name varchar(70) DEFAULT NULL,
            S_tin varchar(15) DEFAULT NULL,
            S_address varchar(30) DEFAULT NULL,
            S_phone varchar(15) DEFAULT NULL,
            S_region enum('local','foreign') DEFAULT 'local',
            S_status enum('active','inactive') DEFAULT 'active',
            S_email varchar(35) DEFAULT NULL,
            S_exempted enum('Taxable','Exempted','') DEFAULT 'Taxable',
            S_rating int(11) DEFAULT NULL,
            S_id varchar(10) NOT NULL,
            S_Added_date date NOT NULL DEFAULT current_timestamp()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS usermanagement (
            Usr_FName varchar(100) DEFAULT NULL,
            Usr_LName varchar(100) DEFAULT NULL,
            Usr_name varchar(25) DEFAULT NULL,
            Usr_type enum('superAdmin','admin','default','intern','guest','CSM','temporal') DEFAULT NULL,
            Usr_status enum('active','inactive') DEFAULT NULL,
            Usr_phone varchar(15) DEFAULT NULL,
            Usr_email varchar(50) DEFAULT NULL,
            Usr_address varchar(20) DEFAULT NULL,
            Usr_dept enum('accounts','procurement','sales','marketing','hr','legal','logistic','IT','pr') DEFAULT NULL,
            Usr_reg_date varchar(20) DEFAULT NULL,
            passwd text DEFAULT NULL,
            activated enum('yes','no') NOT NULL,
            Usr_StaffID varchar(15) DEFAULT NULL,
            Usr_id char(36) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS tokens (
            UserName varchar(11) DEFAULT NULL,
            TokenValue varchar(255) NOT NULL,
            ExpiryTimestamp timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            CreationTimestamp timestamp NOT NULL DEFAULT current_timestamp(),
            TokenType varchar(50) DEFAULT NULL,
            Status enum('unused','used','expired','revoked') NOT NULL,
            IPAddress varchar(45) DEFAULT NULL,
            UserLocation varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
            UserAgent varchar(255) DEFAULT NULL,
            TokenID char(36) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            
        CREATE TABLE IF NOT EXISTS all_action_logs (
            Act_Log_ID int(11) NOT NULL,
            Act_Log_DateTime varchar(50) NOT NULL,
            Act_Log_Message text NOT NULL,
            Date_Time datetime NOT NULL DEFAULT current_timestamp()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS all_error_logs (
            Act_Log_ID int(11) NOT NULL,
            Act_Log_DateTime varchar(50) NOT NULL,
            Act_Log_Message text NOT NULL,
            Date_Time datetime NOT NULL DEFAULT current_timestamp()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS all_message_logs (
            Act_Log_ID int(11) NOT NULL,
            Act_Log_DateTime varchar(50) NOT NULL,
            Act_Log_Message text NOT NULL,
            Date_Time datetime NOT NULL DEFAULT current_timestamp()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS all_server_logs (
            Act_Log_ID int(11) NOT NULL,
            Act_Log_DateTime varchar(50) NOT NULL,
            Act_Log_Message text NOT NULL,
            Date_Time datetime NOT NULL DEFAULT current_timestamp()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE IF NOT EXISTS all_sucesss_logs (
            Act_Log_ID int(11) NOT NULL,
            Act_Log_DateTime varchar(50) NOT NULL,
            Act_Log_Message text NOT NULL,
            Date_Time datetime NOT NULL DEFAULT current_timestamp()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        ALTER TABLE inventory
        ADD PRIMARY KEY (Itm_id),
        ADD UNIQUE KEY Itm_id (Itm_id),
        ADD UNIQUE KEY Itm_autoincrement (Itm_autoincrement);

        ALTER TABLE suppliers
        ADD PRIMARY KEY (S_id),
        ADD UNIQUE KEY S_id (S_id),
        ADD UNIQUE KEY S_phone (S_phone);

        ALTER TABLE usermanagement
        ADD PRIMARY KEY (Usr_id),
        ADD UNIQUE KEY Usr_id (Usr_id),
        ADD UNIQUE KEY Usr_phone (Usr_phone),
        ADD UNIQUE KEY Usr_email (Usr_email);

        ALTER TABLE all_action_logs
        ADD PRIMARY KEY (Act_Log_ID),
        ADD UNIQUE KEY Act_Log_ID (Act_Log_ID);

        ALTER TABLE all_error_logs
        ADD PRIMARY KEY (Act_Log_ID),
        ADD UNIQUE KEY Act_Log_ID (Act_Log_ID);

        ALTER TABLE all_message_logs
        ADD PRIMARY KEY (Act_Log_ID),
        ADD UNIQUE KEY Act_Log_ID (Act_Log_ID);

        ALTER TABLE all_server_logs
        ADD PRIMARY KEY (Act_Log_ID),
        ADD UNIQUE KEY Act_Log_ID (Act_Log_ID);

        ALTER TABLE all_sucesss_logs
        ADD PRIMARY KEY (Act_Log_ID),
        ADD UNIQUE KEY Act_Log_ID (Act_Log_ID);
    `
module.exports = { DBTables }
