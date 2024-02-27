-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2024 at 06:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `warehouseghana_erp`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `Com_name` varchar(70) DEFAULT NULL,
  `Com_tin` varchar(15) DEFAULT NULL,
  `Com_address` varchar(30) DEFAULT NULL,
  `Com_phone` varchar(15) DEFAULT NULL,
  `Com_email` varchar(35) DEFAULT NULL,
  `Com_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`Com_name`, `Com_tin`, `Com_address`, `Com_phone`, `Com_email`, `Com_id`) VALUES
('ELECTROMETER GHANA LIMITED', 'C00034843849', 'KUMASI', '0540504045', 'ELECTROMER.GMAIL.COM', '3bc8f4f3-7e10-11ee-a1e7-8cec4bf253e4'),
('WAREHOUSE GHANA', 'C0003453234', 'ACCRA', '0245152082', 'SALES@WAREHOUSEGHANA.COM', '3bc8f62e-7e10-11ee-a1e7-8cec4bf253e4'),
('Electricity Company of Ghana', 'C0003793483', 'ACCRA CENTRAL', '0540544764', 'ECGGHANA.GOV.GH', '3bc8f6e9-7e10-11ee-a1e7-8cec4bf253e4');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `Itm_autoincrement` int(11) NOT NULL,
  `Itm_cat` varchar(25) DEFAULT '""',
  `Itm_name` varchar(50) NOT NULL,
  `Itm_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `Itm_img` blob DEFAULT NULL,
  `Itm_qty` int(11) NOT NULL,
  `Itm_price` int(11) NOT NULL,
  `Itm_sup_id` varchar(50) NOT NULL,
  `Itm_usr_id` varchar(50) NOT NULL,
  `Itm_taxable` enum('CST','EXM','','TRSM') NOT NULL,
  `itm_date` date NOT NULL,
  `Itm_id` char(36) NOT NULL,
  `Itm_UOM` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`Itm_autoincrement`, `Itm_cat`, `Itm_name`, `Itm_status`, `Itm_img`, `Itm_qty`, `Itm_price`, `Itm_sup_id`, `Itm_usr_id`, `Itm_taxable`, `itm_date`, `Itm_id`, `Itm_UOM`) VALUES
(80, 'NAILS', '4 INCHES ALUMINIUM ROOFING NAIL', 'Active', '', 70, 650, 'B63HI', '6D7D94', '', '2024-02-11', '156F68', 'BOX'),
(81, 'COMPUTER', '12 INCH DELL LAPTOP 360 BLUE SHADE', 'Active', '', 200, 20000, 'B63H', '6D7D94', 'EXM', '2024-02-11', '7D586C', 'PC'),
(79, 'NETWORK', '4G SURVEILLANCE PROTOCOL PACK', 'Active', '', 7500, 126, 'FR5C', '6D7D94', 'CST', '2024-02-11', 'BCB45D', 'TIER'),
(77, 'ROOM', 'EXECUTIVE HOTEL ROOM WITH SHOWER BATH (AC)', 'Active', '', 7, 1500, 'B63H', '6D7D94', 'TRSM', '2024-02-11', 'EC1CEB', 'SINGLE');

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `Inv_ID_auto` int(15) NOT NULL,
  `autoIncrementID` int(11) DEFAULT 0,
  `Inv_Product_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `Inv_Product_Discount` varchar(100) DEFAULT NULL,
  `Inv_Pro_Price` varchar(50) DEFAULT NULL,
  `Inv_user` varchar(30) DEFAULT NULL,
  `Inv_total_amt` decimal(10,2) DEFAULT 0.00,
  `Inv_status` enum('PURCHASE','INVOICE','REFUND','REFUND_CANCELATION','PURREF','PURREFCAN','PARTIAL_REFUND') DEFAULT 'INVOICE',
  `Inv_Calc_Type` varchar(20) DEFAULT 'INCLUSIVE',
  `Inv_date` date DEFAULT current_timestamp(),
  `Inv_Type` enum('QUOTATIO','PURCHASE ORDER','ORIGINAL') DEFAULT 'ORIGINAL',
  `currency` enum('GHS','USD','GBP','EUR') DEFAULT 'GHS',
  `Inv_Sale_Type` varchar(15) DEFAULT 'NORMAL',
  `Inv_Number` varchar(20) NOT NULL,
  `Inv_Customer_Tin` varchar(15) DEFAULT 'C0000000000',
  `Inv_Product_qty` varchar(30) DEFAULT NULL,
  `Inv_discount` decimal(10,2) DEFAULT 0.00,
  `Inv_ext_Rate` decimal(10,2) DEFAULT 0.00,
  `Inv_vat` decimal(10,2) DEFAULT 0.00,
  `Inv_id` varchar(36) NOT NULL DEFAULT current_timestamp(),
  `Inv_Reference` varchar(100) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `nhil` decimal(10,2) DEFAULT 0.00,
  `getfund` decimal(10,2) DEFAULT 0.00,
  `covid` decimal(10,2) DEFAULT 0.00,
  `cst` decimal(10,2) DEFAULT 0.00,
  `tourism` decimal(10,2) DEFAULT 0.00,
  `Inv_Discount_Type` varchar(20) DEFAULT NULL,
  `ysdcid` varchar(20) DEFAULT NULL,
  `ysdcrecnum` varchar(32) DEFAULT NULL,
  `ysdcintdata` varchar(35) DEFAULT NULL,
  `ysdcregsig` varchar(25) DEFAULT NULL,
  `ysdcmrc` varchar(15) DEFAULT NULL,
  `ysdcmrctim` varchar(20) DEFAULT NULL,
  `ysdctime` varchar(20) DEFAULT NULL,
  `qr_code` text DEFAULT NULL,
  `Inv_delivery_fee` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`Inv_ID_auto`, `autoIncrementID`, `Inv_Product_id`, `Inv_Product_Discount`, `Inv_Pro_Price`, `Inv_user`, `Inv_total_amt`, `Inv_status`, `Inv_Calc_Type`, `Inv_date`, `Inv_Type`, `currency`, `Inv_Sale_Type`, `Inv_Number`, `Inv_Customer_Tin`, `Inv_Product_qty`, `Inv_discount`, `Inv_ext_Rate`, `Inv_vat`, `Inv_id`, `Inv_Reference`, `remarks`, `nhil`, `getfund`, `covid`, `cst`, `tourism`, `Inv_Discount_Type`, `ysdcid`, `ysdcrecnum`, `ysdcintdata`, `ysdcregsig`, `ysdcmrc`, `ysdcmrctim`, `ysdctime`, `qr_code`, `Inv_delivery_fee`) VALUES
(202, 0, '[\"8A3DBC\",\"BCB45D\"]', '[\"900\",0]', '[650,\"116\"]', 'Warehouse.Ghana', 59312.00, 'INVOICE', 'INCLUSIVE', '2024-02-11', 'ORIGINAL', 'GHS', 'NORMAL', '1565943346', 'C0000000099', '[\"90\",\"7\"]', 900.00, 1.00, 7618.95, '14C1BB', '', '', 1197.20, 1197.20, 478.88, 31.81, 0.00, 'GENERAL', 'E000010001', '10001-5F80-NS838', 'FCS4-LTMO-GHYJ-FOKN-RGXX-2KPC-4I', 'D4YT-SEFW-MH57-UTBK', '00:0C:29:0D:90:', '2024/02/11 21:42:29', '2024/02/11 21:42:29', 'https://evat-verificationqa.persolqa.com?data=1hScUHYZXqsiETdXYH0B/hOjWcosFtH/Y0nddc0A/4qgvU+xH7Cf/aCXvJs+CFGlFUbl+gXAlCM4Eh75Wv/r/2CW8yN3HkUpvb4mt/ARpFfDxxeoVd8Cqk7Rf60zQIa8CPrq9icz0XQSSNtqiMNbSvidV9HRfMla/Ftrn3O/84w8YEQS7nZNJfm5MfhHCcXWK2TEy914xuy8h5SdtIASEA7kd6lmB9Jx5+w5hS9qnsbLKJGgF/4AVDkU5dRJTUz488NwrL93UqmKZuQ8oca+iAiR/Dd76zNYnqWP96HZTAE=&v=1.1', ''),
(203, 0, '[\"BCB45D\"]', '[0]', '[116]', 'Warehouse.Ghana', 232.00, 'PARTIAL_REFUND', 'INCLUSIVE', '2024-02-11', 'ORIGINAL', 'GHS', 'NORMAL', '1565943346', 'C0000000099', '[2]', 0.00, 1.00, 30.26, 'C7E517', '0330697653', '', 4.54, 4.54, 1.82, 9.09, 0.00, 'GENERAL', 'E000010001', '10001-5F80-NR244', 'EISX-77CF-AHUF-JCTB-Q5OO-YAZZ-KE', 'R3QB-DARZ-KQCM-74XL', '00:0C:29:0D:90:', '2024/02/11 21:58:39', '2024/02/11 21:58:39', 'https://evat-verificationqa.persolqa.com?data=deTzEWyr9Ph9CcJQ9ouYzw3OlC5MJSlobGgMDqdDmDqgnQhRHF/TnxihT1i2ldzpxEnZaM/RDCJ1yQePx/C0W/Iw+ya7ztQlhD8n4a724jZiDGnnw1e8p80iK10Zt5bKZ4sqObUfdxPBur4iyxINLU6tyVBeBnRo/uA9kMyGKBrGVc1n3qh+AmfKKymHKlMuR4UbaQQYSzoPfKIwBbhhpm0PsTGORAuFJvmfldAKxAQXBicZxhJ+R7KkFbJOStzcCGlfUHOvnFQwuAJLyb/OChT4on+0YUNo8xPuIC5yAJE=&v=1.1', ''),
(204, 0, '[\"BCB45D\"]', '[0]', '[116]', 'Warehouse.Ghana', 232.00, 'PARTIAL_REFUND', 'INCLUSIVE', '2024-02-11', 'ORIGINAL', 'GHS', 'NORMAL', '1565943346', 'C0000000099', '[2]', 0.00, 1.00, 30.26, '2B2B41', '3644232720', '', 4.54, 4.54, 1.82, 9.09, 0.00, 'GENERAL', 'E000010001', '10001-5F80-NR245', 'EISX-77CF-AHUF-JCTB-Q5OO-YAZZ-KE', '6P7J-XQX6-O3HK-TUG7', '00:0C:29:0D:90:', '2024/02/11 22:02:15', '2024/02/11 22:02:15', 'https://evat-verificationqa.persolqa.com?data=deTzEWyr9Ph9CcJQ9ouYzw3OlC5MJSlobGgMDqdDmDqgnQhRHF/TnxihT1i2ldzpxEnZaM/RDCJ1yQePx/C0W2Ixsbu/gjQJ+S5xfjZLof+9x32AF4CZGIoNTdnc0JPeKU9cC+Q+6JWH11Hj6SXg5VjBpA578adtE3l5FTZnNhV+aVr69WS8f352avNGGS5XIXOspOV/IerY/vSRkdIIs20Sfe3sztXj8C9HDA9wtFoNTqdnSS36kSlWJ5bVsJkLoYLOQ1LAcpIF+0qdKc/4ojQpIdf+NyodaNwctm0Gw9Y=&v=1.1', ''),
(205, 0, '[\"BCB45D\",\"156F68\"]', '[0,\"70\"]', '[126,\"65\"]', 'Warehouse.Ghana', 1524.00, 'INVOICE', 'EXCLUSIVE', '2024-02-11', 'ORIGINAL', 'USD', 'NORMAL', '1557268269', 'C0000000099', '[\"9\",\"6\"]', 70.00, 12.00, 239.69, 'D6B1F2', '', '', 36.35, 36.35, 14.54, 56.70, 0.00, 'GENERAL', 'E000010001', '10001-5F80-NS839', 'TNCE-63DS-WTUL-HYKV-YJIK-JM7Z-S4', 'PJGM-NE2A-XAC3-VEBJ', '00:0C:29:0D:90:', '2024/02/11 22:12:52', '2024/02/11 22:12:52', 'https://evat-verificationqa.persolqa.com?data=deTzEWyr9Ph9CcJQ9ouYzwtaRgIYMgLlx0btmlB63qP1DVVD/2c1iDKIhucGWPQ2KdXU9ll+RuE6MpuXPOKOhYUgbpHX/WLxVQ4kz4VtctvxCoANAFfFUjWnuDip1eji4b3xnLhv950j4fxUaLKVBzttdi+2u0fZCTiG2HPo8xkvrsmwHkLxMizMXvE+nOwgeRkiKF08kcG7HIgSioQ/htpLc7JT7lOZFt6TTSeYfWS617UmH710LPP0SfYfSuEeZbT/kDTZcftYQLUMave9ASUjjBdQEia6LDLXSBsyiAo=&v=1.1', ''),
(206, 0, '[\"BCB45D\",\"156F68\"]', '[0,70]', '[126,65]', 'Warehouse.Ghana', 634.00, 'PARTIAL_REFUND', 'EXCLUSIVE', '2024-02-11', 'ORIGINAL', 'USD', 'NORMAL', '1557268269', 'C0000000099', '[4,2]', 70.00, 12.00, 93.46, 'E89B78', '8484429321', '', 14.10, 14.10, 5.64, 25.20, 0.00, 'GENERAL', 'E000010001', '10001-5F80-NR246', 'Y4WY-OB76-Z6R4-YRWB-CLGD-HJSE-C4', 'TAAW-NY62-PJQA-5NO6', '00:0C:29:0D:90:', '2024/02/11 22:13:34', '2024/02/11 22:13:34', 'https://evat-verificationqa.persolqa.com?data=ST+HbrVBGZeB4HhaaNh7IUg5MxqSnx3RwOrKgVjeiIwse6PIg6kllk1qNU0Xje0CbR0JpbIOYLLpR5KcOBzbyeclr06oSiibQoFJZU8R5q0E2Iq1s0aovqMBNZrHLzyp07X4ab15LwvOL61u5CZwyvMszefDyKsD4fMuWo0nK4Mi+VmGqInQrApdSMi7Dxg05WFdjdbO2ycXtYndd0SlYubjmPuVb3kNBCi5t6zum9nLTD8KnChFvDKWYnFk/EVoV5NnUvZIIbvBJSQC+lateRtzHl5V5KiV/gjaQnpodr8=&v=1.1', ''),
(207, 0, '[\"BCB45D\",\"156F68\"]', '[0,70]', '[126,65]', 'Warehouse.Ghana', 382.00, 'PARTIAL_REFUND', 'EXCLUSIVE', '2024-02-11', 'ORIGINAL', 'USD', 'NORMAL', '1557268269', 'C0000000099', '[2,2]', 70.00, 12.00, 51.50, '448B0B', '6712970632', '', 7.80, 7.80, 3.12, 12.60, 0.00, 'GENERAL', 'E000010001', '10001-5F80-NR247', 'X5F6-GFVG-GRB4-BDJ7-3WCE-ZGTN-AM', 'PEE4-FPQE-WT6P-4G2U', '00:0C:29:0D:90:', '2024/02/11 22:16:03', '2024/02/11 22:16:03', 'https://evat-verificationqa.persolqa.com?data=1hScUHYZXqsiETdXYH0B/spOS2NTiOE37SvDT1ETcNgXk2ouUUPo8hzX3ZzslERrECRlNTJXgj+h/qX2D/2l6yTNGcZhar/x3aIKHXpK9ThSpdZqATnvHb3wkjZ7cqw9FAjdJWOw32JLYIYK9uVIMvhjoJKT4t8IhqRAYfOP/FW39IEuod5VwxJe8i4lcCSrlCsPwXfDH5DO+sGVGe4EeQE4G5kRI0eD+WeIRxJrq/Cl8CqNsIK+qkDzuGvwDdGA6lxS2x8lfwCU6FqN1Uxt99pI+4wIiZvg1xo2SFDbh8I=&v=1.1', ''),
(208, 0, '[\"BCB45D\"]', '[0]', '[116]', 'James', 232.00, 'PARTIAL_REFUND', 'INCLUSIVE', '2024-02-11', 'ORIGINAL', 'GHS', 'NORMAL', '1565943346', 'C0000000099', '[2]', 0.00, 1.00, 30.26, 'C67DC3', '7432994143', '', 4.54, 4.54, 1.82, 9.09, 0.00, 'GENERAL', 'E000010001', '10001-5F81-NR248', 'EISX-77CF-AHUF-JCTB-Q5OO-YAZZ-KE', 'DUMQ-YEAM-V2EO-MHOO', '00:0C:29:0D:90:', '2024/02/12 00:08:32', '2024/02/12 00:08:32', 'https://evat-verificationqa.persolqa.com?data=deTzEWyr9Ph9CcJQ9ouYzw3OlC5MJSlobGgMDqdDmDqgnQhRHF/TnxihT1i2ldzpxEnZaM/RDCJ1yQePx/C0W4HyLR71yeJYOHQCdvAt6RP0Ir91j2oVBLdsS7YBOvVcsrch/SAEBj5jpfxgW143VmINy9OpVtSMuotMuqpnDv89ETaCladqjZ3dy31ePEvQqMTlQ1mMQn/sQ8M2XtNKCuPmf7qp9oNed6r8Skj4bwoxvh3Bzp2+j6so8xwWvc4YQD14TDbOc8oQtyg+YBGO8LxKCsRqp3WUQhXnhOh2880=&v=1.1', ''),
(209, 0, '[\"BCB45D\"]', '[0]', '[116]', 'James', 116.00, 'PARTIAL_REFUND', 'INCLUSIVE', '2024-02-11', 'ORIGINAL', 'GHS', 'NORMAL', '1565943346', 'C0000000099', '[1]', 0.00, 1.00, 15.13, '432367', '6671606059', '', 2.27, 2.27, 0.91, 4.54, 0.00, 'GENERAL', 'E000010001', '10001-5F81-NR249', 'MM4S-BKI3-BXX5-TECH-BOTD-6URD-B4', 'INXM-HRTU-HBOW-GE4J', '00:0C:29:0D:90:', '2024/02/12 00:09:06', '2024/02/12 00:09:06', 'https://evat-verificationqa.persolqa.com?data=Tgwfru4p/COzuGWHqIam5WA3UNJNJUrWLPS/4Pfytv+1NVqXfPxVtXTgbhBsF1MF0HylgI8NgTJAPyZs04ck6grVB1a5yXeqUlpJbbWad9SNbgau80ZAwkPiv0IBIJyu7Cr5ApMpVUrlkk0QobAvbDmlkHHRwRNU8+LJMOwIYFtDFX8woeMZ8B8k1EnC3kAn0f6l1kjN6il5AfFIktEdaOXvjkmWngG01vWMMuU1BD4g7xvbzX73P5+J1BuxBNvk5fLdW6Cwb5vRvyRj+dwTOQ9lDM9gjeX04KEZm72dNsw=&v=1.1', ''),
(210, NULL, NULL, NULL, NULL, 'James', 232.00, 'REFUND_CANCELATION', NULL, '2024-02-11', 'ORIGINAL', NULL, NULL, '1565943346', NULL, NULL, NULL, NULL, NULL, '8106E6', '7432994143', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `suppliersncustomers`
--

CREATE TABLE `suppliersncustomers` (
  `SnC_Type` enum('supplier','customer','','') DEFAULT NULL,
  `SnC_name` varchar(70) DEFAULT NULL,
  `SnC_tin` varchar(15) DEFAULT NULL,
  `SnC_address` varchar(30) DEFAULT NULL,
  `SnC_phone` varchar(15) DEFAULT NULL,
  `SnC_region` enum('local','foreign') DEFAULT 'local',
  `SnC_status` enum('active','inactive') DEFAULT 'active',
  `SnC_email` varchar(35) DEFAULT NULL,
  `SnC_pro_id` varchar(10) DEFAULT NULL,
  `SnC_exempted` enum('yes','no') DEFAULT 'no',
  `SnC_rating` enum('reliable','notRely','good','bad') DEFAULT NULL,
  `SnC_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliersncustomers`
--

INSERT INTO `suppliersncustomers` (`SnC_Type`, `SnC_name`, `SnC_tin`, `SnC_address`, `SnC_phone`, `SnC_region`, `SnC_status`, `SnC_email`, `SnC_pro_id`, `SnC_exempted`, `SnC_rating`, `SnC_id`) VALUES
('customer', 'fred(cash customer)', 'C0000000099', 'ACCRA', '0540544347', 'local', 'active', 'FRED@GMAIL.COM', '', 'no', '', '0PS32F'),
('customer', 'Walk-In Customer', 'C0000000000', 'NA', '024XXXXXXX', '', 'active', '', '', 'no', '', '5CHS3S'),
('supplier', 'AKWETER ENTERPRISE', 'C0002434523', 'ABLEKUMA', '0540544769', 'local', 'active', 'AKWETER@GMAIL.COM', '1', 'no', 'reliable', 'B63H'),
('supplier', 'AZAR CHEMICALS MANUFACTURING LIMITED', 'C0001434523', 'SPINTEX', '0302544769', 'local', 'active', 'INFO@AZARCHEMICALS.COM', '23', 'yes', 'reliable', 'B63HI'),
('supplier', 'Siblings Love Inc.', 'C0002340238', 'Accra Central', '233549304453', 'foreign', 'active', 'siblings@gmail.com', '1', 'yes', 'good', 'FR5C');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `UserName` varchar(11) DEFAULT NULL,
  `TokenValue` varchar(255) NOT NULL,
  `ExpiryTimestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CreationTimestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `TokenType` varchar(50) DEFAULT NULL,
  `Status` enum('unused','used','expired','revoked') NOT NULL,
  `IPAddress` varchar(45) DEFAULT NULL,
  `UserLocation` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `UserAgent` varchar(255) DEFAULT NULL,
  `TokenID` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`UserName`, `TokenValue`, `ExpiryTimestamp`, `CreationTimestamp`, `TokenType`, `Status`, `IPAddress`, `UserLocation`, `UserAgent`, `TokenID`) VALUES
('ware3', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhcmVob3VzZWdoYW5hNUBnbWFpbC5jb20iLCJpYXQiOjE3MDE3MzAwMjgsImV4cCI6MTcwMTczMTgyOH0.TQ-q6zcjMWLZP1OfGA--x6FoF-glN7Uexn4QXKuT7u0', '2023-12-04 23:17:08', '2023-12-04 22:47:09', 'JWT', 'unused', '102.176.101.30', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0', '24507ca1-92f7-11ee-a8af-8cec4bf253e4'),
('ware3', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhcmVob3VzZWdoYW5hNUBnbWFpbC5jb20iLCJpYXQiOjE3MDE3MzAwNDQsImV4cCI6MTcwMTczMTg0NH0.Wi5bQm59eyviFPjk9OXnm2W3ZgXeNdJcQsg0Ytutzeg', '2023-12-04 23:17:24', '2023-12-04 22:47:24', 'JWT', 'unused', '102.176.101.30', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0', '2da37914-92f7-11ee-a8af-8cec4bf253e4'),
('James23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlcjIxQGdtYWlsLmNvbSIsImlhdCI6MTcwMjkzMDQzMywiZXhwIjoxNzAyOTMyMjMzfQ.A_kSfk9iWxeTTO8lypmB1wAlv8Fm-bLjh3Dei63f_zI', '2023-12-18 20:43:53', '2023-12-18 20:13:53', 'JWT', 'unused', '102.176.101.37', 'GH', 'PostmanRuntime/7.36.0', '10AB1A69B3FD404DB60C'),
('James230', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlcjFAZ21haWwuY29tIiwiaWF0IjoxNzAyOTMyNTY3LCJleHAiOjE3MDI5MzQzNjd9.Ko5cQ4aZHaMPT78VMpVP-XOMtCRsqXlE0AnL5mroRNg', '2023-12-18 21:19:27', '2023-12-18 20:49:27', 'JWT', 'unused', '102.176.101.37', 'GH', 'PostmanRuntime/7.36.0', 'A96E7DA1842D4921BC58'),
('ware3', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhcmVob3VzZWdoYW5hNUBnbWFpbC5jb20iLCJpYXQiOjE3MDM0MjUzMDEsImV4cCI6MTcwMzQyNjIwMX0.l8wWZU9N4B_KmE3zyQPKWCPCs8Lu6sIXwvWDRr_tJSI', '2023-12-24 13:56:41', '2023-12-24 13:41:42', 'JWT', 'unused', '102.176.65.49', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '20F22266AE174BB2A3BD'),
('ware3', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhcmVob3VzZWdoYW5hNUBnbWFpbC5jb20iLCJpYXQiOjE3MDM0MjUzMjIsImV4cCI6MTcwMzQyNjIyMn0.QKTcc2fKuxrhLMVBY2f5Bd-2SOSBqNdBnT5nK9D9zD0', '2023-12-24 13:57:02', '2023-12-24 13:42:02', 'JWT', 'unused', '102.176.65.49', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', 'D5CEEFE27EBA43A0BDF1'),
('oko23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDM0MjU1MzgsImV4cCI6MTcwMzQyNjQzOH0.ncu_X-p-KPfOwSI2GkGYVbLlBj_JEefDrhUdxT8lkr4', '2023-12-24 14:00:38', '2023-12-24 13:45:38', 'JWT', 'unused', '102.176.65.49', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', 'DB98D26238414877A9C1'),
('oko23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDM0MjU4NTEsImV4cCI6MTcwMzQyNjc1MX0.euPawCVgUe-DH8q-oqCVsbvaV1cc-o3iaKX-Q9uG1-s', '2023-12-24 14:05:51', '2023-12-24 13:50:51', 'JWT', 'unused', '102.176.65.49', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', 'AE42DF5260AC4490B182'),
('oko23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDM0MjYxNTYsImV4cCI6MTcwMzQyNzA1Nn0.MqQVrjci8Yg8h3qj8361zmJSi7QOFE7sX_t7Oi4n5EM', '2023-12-24 14:10:56', '2023-12-24 13:55:56', 'JWT', 'unused', '102.176.65.49', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '65FE9B633248485E8003'),
('ware3', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhcmVob3VzZWdoYW5hNUBnbWFpbC5jb20iLCJpYXQiOjE3MDM0Mjk5MTcsImV4cCI6MTcwMzQzMTcxN30.Tb5fWUXnEAwdb_5YD02u_0H0Vov1b8hsrEyngKXd9H0', '2023-12-24 15:28:37', '2023-12-24 14:58:37', 'JWT', 'unused', '102.176.65.49', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '8DE3E00183CE4AD0ADBC'),
('Akweter', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckB0cnkuY29tIiwiaWF0IjoxNzAzNDQyNDgxLCJleHAiOjE3MDM0NDMzODF9.F6_qROB5ghWAbyPYxtUZ4wJaeVPppiev-dliUPABQ1Q', '2023-12-24 18:43:01', '2023-12-24 18:28:01', 'JWT', 'unused', '102.176.65.31', 'GH', 'PostmanRuntime/7.36.0', '9684BC86564440C4BF70'),
('Jamegs23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlcjIzMUBnbWFpbC5jb20iLCJpYXQiOjE3MDUwNTAzODAsImV4cCI6MTcwNTA1Mzk4MH0.vaMeSZri-5fvsOoAFJRtTp9yVXucSNw2cUfNuwFXrKQ', '2024-01-12 10:06:20', '2024-01-12 09:06:20', 'JWT', 'unused', '197.251.228.146', 'GH', 'PostmanRuntime/7.36.0', 'C859933B0FA24828BBD6'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDUwNTA0NzcsImV4cCI6MTcwNTA1NDA3N30.X71w2dxvAjPiKFYiDkaL0xtONhR7ZMjW5H1KgzMH5DU', '2024-01-12 10:07:57', '2024-01-12 09:07:57', 'JWT', 'unused', '197.251.228.146', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', 'F83A1A1755B049B2AA50'),
('James1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDU0NDgwMTEsImV4cCI6MTcwNTQ1MTYxMX0.Kaj3DUzMwwUaSpqSBhjaIFagzD4Df1rENLBZ3biyNP0', '2024-01-17 00:33:31', '2024-01-16 23:33:31', 'JWT', 'unused', '154.160.17.95', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '9BD5E4'),
('James203', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlcjgzOTRAZ21haWwuY29tIiwiaWF0IjoxNzA1NTcwMTI4LCJleHAiOjE3MDU1NzM3Mjh9.pU1pfD50EFlb__gNV-jn5yRByA9OjlHPkKJ7954NEzY', '2024-01-18 10:28:48', '2024-01-18 09:28:48', 'JWT', 'unused', '154.160.22.107', 'GH', 'PostmanRuntime/7.36.1', 'AEA399'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDU1NzA2NjgsImV4cCI6MTcwNTU3NDI2OH0.LZxo1SWFJmxUBPD_-rpCjHdT7IAOyN7dk6edNPdFz6A', '2024-01-18 10:37:48', '2024-01-18 09:37:48', 'JWT', 'unused', '154.160.22.107', 'GH', 'PostmanRuntime/7.36.1', 'EF6DEC'),
('Warehouse.G', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhcmVob3VzZWdoYW5hNUBnbWFpbC5jb20iLCJpYXQiOjE3MDY5NjY2NjgsImV4cCI6MTcwNjk3MDI2OH0.mAx_SXdWUDpExqSPmvJ32KXpASpyZSzFt9917g3HGlY', '2024-02-03 14:24:28', '2024-02-03 13:24:28', 'JWT', 'unused', '154.160.19.185', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '12240A'),
('Warehouse.G', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhcmVob3VzZWdoYW5hNUBnbWFpbC5jb20iLCJpYXQiOjE3MDY5NjY4NjksImV4cCI6MTcwNjk3MDQ2OX0.uTacSSGk3ZrNOyLbBW6r6rU0Y3WYmXPbVuDsEP_eslQ', '2024-02-03 14:27:49', '2024-02-03 13:27:49', 'JWT', 'unused', '154.160.19.185', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '16D9FA'),
('Warehouse.G', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhcmVob3VzZWdoYW5hNUBnbWFpbC5jb20iLCJpYXQiOjE3MDY5NjY4ODcsImV4cCI6MTcwNjk3MDQ4N30.jFidUGxFz07s4hM28glKGUI8-KPYwkSNr_DTXKIOc0o', '2024-02-03 14:28:07', '2024-02-03 13:28:08', 'JWT', 'unused', '154.160.19.185', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '880D2C'),
('Addo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkZG9iZW4yMDI0QGdtYWlsLmNvbSIsImlhdCI6MTcwNjk5ODk0NiwiZXhwIjoxNzA3MDAyNTQ2fQ.LP03P9Mwkj3fzzW03HG7i_YReVFa4sBpy4L3oTsT5yg', '2024-02-03 23:22:26', '2024-02-03 22:22:26', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', 'A2EEE6'),
('Cham', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzA5NTEsImV4cCI6MTcwNzA3NDU1MX0._aECrsQ3OcMwycTFZ8EYQJaTzjPjbCXmWpBR-4Un-jA', '2024-02-04 19:22:31', '2024-02-04 18:22:31', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '8D1704'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzEyNTIsImV4cCI6MTcwNzA3NDg1Mn0.5jpMAdNI39qp7k6afFTw1gfG1Jwyq3wDKworcaMYsYs', '2024-02-04 19:27:32', '2024-02-04 18:27:33', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '808C7E'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzEyNjksImV4cCI6MTcwNzA3NDg2OX0.ihBLwFF0Q-Hk9yX0XxTF7YLXw9CiMmgYwJE-Zz49qWM', '2024-02-04 19:27:49', '2024-02-04 18:27:49', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '17638D'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzE2NDcsImV4cCI6MTcwNzA3NTI0N30.RKOjsdwTNLi5ISsXCcTHiH0qITjTvfIqVrJl2rndvPU', '2024-02-04 19:34:07', '2024-02-04 18:34:08', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '52BEE7'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzI4NjEsImV4cCI6MTcwNzA3NjQ2MX0.w13Cmgzp6AFf4_ApN4oKhMDqAWtvpD2d6kE8geGj5es', '2024-02-04 19:54:21', '2024-02-04 18:54:21', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '921ECA'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzM2MDksImV4cCI6MTcwNzA3NzIwOX0._LQzHL1QPviEfkdKHwvVNw4hqyZ24qYB8JDsu4Q9Mj4', '2024-02-04 20:06:49', '2024-02-04 19:06:49', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '68B30D'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzM2MjEsImV4cCI6MTcwNzA3NzIyMX0.eJijfWZmmP38zaXudc6K7ShJVyoDTQMJ6eauziMXaiA', '2024-02-04 20:07:01', '2024-02-04 19:07:02', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '68090F'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzM3MTgsImV4cCI6MTcwNzA3NzMxOH0.McTOJZsF3UgtdeBSNSiNhqA2JoUiR1PmS79-834o4Ro', '2024-02-04 20:08:38', '2024-02-04 19:08:39', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '196D1E'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzM4NjUsImV4cCI6MTcwNzA3NzQ2NX0.Qt9PWYE9pT4vjR2XCSJlzZKaMU4uVFt9_vmODZmY-Lg', '2024-02-04 20:11:05', '2024-02-04 19:11:05', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '42EEF2'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcwNzU1NzYsImV4cCI6MTcwNzA3OTE3Nn0.TzI3v63zA0PInAtYLh8sN4xYfGiyWpgOEgVnNtmgPvU', '2024-02-04 20:39:36', '2024-02-04 19:39:36', 'JWT', 'unused', '154.160.23.194', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '8EB52A'),
('Michela', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJlbWFkb3JhMTRAZ21haWwuY29tIiwiaWF0IjoxNzA3MTE4OTQ0LCJleHAiOjE3MDcxMjI1NDR9.Iho-0seUG5_jVqxxP_sd6vpbrD7YuDhLXpjyB2aR7DU', '2024-02-05 08:42:24', '2024-02-05 07:42:24', 'JWT', 'unused', '197.251.228.146', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36', '90AE94'),
('Nyarkoa', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFmaWFhYnJvbm9tYTUyMUBnbWFpbC5jb20iLCJpYXQiOjE3MDcxMjAwNjksImV4cCI6MTcwNzEyMzY2OX0.nFqNNsmhNiZNljAtOxhVqWSjUQAZATwmsmbKn_5wYXk', '2024-02-05 09:01:09', '2024-02-05 08:01:09', 'JWT', 'unused', '197.251.228.146', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36', '1CF14B'),
('gthreerash', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd0aHJlZXJhc2hAZ21haWwuY29tIiwiaWF0IjoxNzA3MTI2NDM0LCJleHAiOjE3MDcxMzAwMzR9.-QRjekigR_Vc6juHcvApboBAlLVthqguo4BcJFqMC68', '2024-02-05 10:47:14', '2024-02-05 09:47:14', 'JWT', 'unused', '197.251.228.146', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36', '5CEB26'),
('trevillion', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFib3RzaXN0YW5sZXkwQGdtYWlsLmNvbSIsImlhdCI6MTcwNzEyNjYzMiwiZXhwIjoxNzA3MTMwMjMyfQ.ofv3muRq36jOLowgAOOpp8H5ZtwTKzXxz9f3nCmRVq0', '2024-02-05 10:50:32', '2024-02-05 09:50:32', 'JWT', 'unused', '197.251.228.146', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '3C43A3'),
('Fred', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZyZWRvY2Fuc2V5NjdAZ21haWwuY29tIiwiaWF0IjoxNzA3MTI5MjE1LCJleHAiOjE3MDcxMzI4MTV9.FQI8CRtfe6ExRlG-OOPqmXEgXAxVnQTaKauD8DDNU5c', '2024-02-05 11:33:35', '2024-02-05 10:33:35', 'JWT', 'unused', '197.251.228.146', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36', '8766E7'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcyMTAzNzQsImV4cCI6MTcwNzIxMzk3NH0.pi-n0aVVHQnHUY7QicLJXQCCMyk9as3OiQSa8DQO04k', '2024-02-06 10:06:14', '2024-02-06 09:06:15', 'JWT', 'unused', '197.251.228.146', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '23C024'),
('James', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDcyMTA0MzUsImV4cCI6MTcwNzIxNDAzNX0.UmsP3wBm7jqpX3d3wC7LwJgvBQA7ZsdDNWgAZNo9QIU', '2024-02-06 10:07:15', '2024-02-06 09:07:16', 'JWT', 'unused', '197.251.228.146', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', 'E41C65'),
('Aku0241', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlpcGV5c2V5QGdtYWlsLmNvbSIsImlhdCI6MTcwNzMwNzU2OSwiZXhwIjoxNzA3MzExMTY5fQ.JldrqX0ag4KF--2_oD_D-TQJraJGtgtjZLdtiq8BISo', '2024-02-07 13:06:09', '2024-02-07 12:06:09', 'JWT', 'unused', '197.251.228.146', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36', 'ACB5AF'),
('Adom', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDg4ODQyNzMsImV4cCI6MTcwODg4Nzg3M30.hDifWhsq52g38C3szyxVI5aNcZ7UTG1RnlkFfktDq7A', '2024-02-25 19:04:33', '2024-02-25 18:04:33', 'JWT', 'unused', '102.176.101.8', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '069BC4'),
('JohnJames', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDg4ODgxMjYsImV4cCI6MTcwODg5MTcyNn0.BEgd0bDh2tnu0FuVxcPd06AaG_ZaY-B8F7mpNgfxySk', '2024-02-25 20:08:46', '2024-02-25 19:08:46', 'JWT', 'unused', '102.176.101.8', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '728EDE'),
('jude', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDg4OTA1MjQsImV4cCI6MTcwODg5NDEyNH0.gVSu4q1YODGrhl9dM4cDM3zk5dSzYVr3ffRw7aRe7j8', '2024-02-25 20:48:44', '2024-02-25 19:48:44', 'JWT', 'unused', '102.176.65.246', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', 'C7D9BC'),
('reda', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDg4OTE3NTYsImV4cCI6MTcwODg5NTM1Nn0.i_Ywji851UvXPqczVJnWTXvH_EM8sZ70twelY_J3gVU', '2024-02-25 21:09:16', '2024-02-25 20:09:16', 'JWT', 'unused', '102.176.65.246', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', 'AF1DB5'),
('Kumi', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzYWt3ZXRlckBnbWFpbC5jb20iLCJpYXQiOjE3MDg4OTMzNjIsImV4cCI6MTcwODg5Njk2Mn0.7o_l8bexskEvCCpEHrBgFkb0tq3gcacZ7pNb4KwX2ys', '2024-02-25 21:36:02', '2024-02-25 20:36:02', 'JWT', 'unused', '102.176.65.246', 'GH', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '7534FF');

-- --------------------------------------------------------

--
-- Table structure for table `usermanagement`
--

CREATE TABLE `usermanagement` (
  `Usr_FName` varchar(100) DEFAULT NULL,
  `Usr_LName` varchar(100) DEFAULT NULL,
  `Usr_name` varchar(25) DEFAULT NULL,
  `Usr_type` enum('superAdmin','admin','default','intern','guest','CSM','temporal') DEFAULT NULL,
  `Usr_status` enum('active','inactive') DEFAULT NULL,
  `Usr_phone` varchar(15) DEFAULT NULL,
  `Usr_email` varchar(25) DEFAULT NULL,
  `Usr_address` varchar(20) DEFAULT NULL,
  `Usr_dept` enum('accounts','procurement','sales','marketing','hr','legal','logistic','IT') DEFAULT NULL,
  `Usr_reg_date` varchar(20) DEFAULT NULL,
  `passwd` text DEFAULT NULL,
  `activated` enum('yes','no') NOT NULL,
  `Usr_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usermanagement`
--

INSERT INTO `usermanagement` (`Usr_FName`, `Usr_LName`, `Usr_name`, `Usr_type`, `Usr_status`, `Usr_phone`, `Usr_email`, `Usr_address`, `Usr_dept`, `Usr_reg_date`, `passwd`, `activated`, `Usr_id`) VALUES
(NULL, NULL, 'James', 'superAdmin', 'active', '0540544760', 'jamesakweter@gmail.co', 'GA-3424-7434', 'IT', '2024-01-18 09:37:48.', '$2a$12$94lIhmcMS2/pEVFaT69/1eo.ySVLG1ISUD50vRbQOVxoSmIcHALXG', 'yes', '4B38CF'),
(NULL, NULL, 'Warehouse.Ghana', NULL, 'active', NULL, 'warehouseghana5@gmail.com', NULL, NULL, '2024-02-03 13:24:28.', '$2a$12$1nFk5sBXuOOfQkLfdiBvL.kX0xbhvAqpWtmw1ZX5DhkfMZJkNqSwW', 'yes', '6D7D94'),
(NULL, NULL, 'Aku0241', NULL, 'active', NULL, 'yipeysey@gmail.com', NULL, NULL, '2024-02-07 12:06:09.', '$2a$12$ZGoqWPMne2AVu5q8ZTHEEusBdU/Gvfzh3NHkHzVdy8PsNG3dEPk66', 'yes', '89B2E1'),
(NULL, NULL, 'trevillion', NULL, 'active', NULL, 'abotsistanley0@gmail.com', NULL, NULL, '2024-02-05 09:50:32.', '$2a$12$gLPO8AzS66FBtrNJi/C8tej7ZvaswfVV8jEXcsRaOD/GOCvwB8TwK', 'yes', '8DD841'),
(NULL, NULL, 'Nyarkoa', NULL, 'active', NULL, 'afiaabronoma521@gmail.com', NULL, NULL, '2024-02-05 08:01:09.', '$2a$12$OhTyr3G0EPC7HJcHa9sHMedW0tEN5yaxsphuClfm3djxPNgyub9yK', 'yes', '8DE7A5'),
(NULL, NULL, 'Fred', NULL, 'active', NULL, 'fredocansey67@gmail.com', NULL, NULL, '2024-02-05 10:33:35.', '$2a$12$QeknUQ5tzuXVeRbTwGBsze9ay/VZnkBMM8M5z46rOxqnFJkeNA58m', 'yes', 'AB7E62'),
(NULL, NULL, 'Addo', NULL, 'active', NULL, 'addoben2024@gmail.com', NULL, NULL, '2024-02-03 22:22:26.', '$2a$12$xMAnz9Ze/t25OOy9V35Z9uqbbnes8O.1B6a5JPOVNrqhbATlc.C02', 'yes', 'C24E72'),
(NULL, NULL, 'gthreerash', NULL, 'active', NULL, 'gthreerash@gmail.com', NULL, NULL, '2024-02-05 09:47:14.', '$2a$12$F00YjvKD.qAJqVqSOLgDxeTtBFsqQRjjE3lo6wN1JUwTeRu35BvFO', 'yes', 'D2378A'),
(NULL, NULL, 'Michela', NULL, 'inactive', NULL, 'bemadora14@gmail.com', NULL, NULL, '2024-02-05 07:42:24.', '$2a$12$z/9e3H2wGhksMcDoZ50Ogerew9Lwa9sW4/gqdVIjGOCpMeJUfqd7q', 'yes', 'E141E7');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`Com_id`),
  ADD UNIQUE KEY `Com_id` (`Com_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`Itm_id`),
  ADD UNIQUE KEY `Itm_id` (`Itm_id`),
  ADD UNIQUE KEY `Itm_autoincrement` (`Itm_autoincrement`),
  ADD KEY `Itm_id_2` (`Itm_id`),
  ADD KEY `Itm_autoincrement_2` (`Itm_autoincrement`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`Inv_ID_auto`);

--
-- Indexes for table `suppliersncustomers`
--
ALTER TABLE `suppliersncustomers`
  ADD PRIMARY KEY (`SnC_id`),
  ADD UNIQUE KEY `Sup_id` (`SnC_id`),
  ADD KEY `Sup_id_2` (`SnC_id`);

--
-- Indexes for table `usermanagement`
--
ALTER TABLE `usermanagement`
  ADD PRIMARY KEY (`Usr_id`),
  ADD UNIQUE KEY `Usr_id` (`Usr_id`),
  ADD UNIQUE KEY `Usr_phone` (`Usr_phone`),
  ADD UNIQUE KEY `Usr_email` (`Usr_email`),
  ADD KEY `Usr_id_2` (`Usr_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `Itm_autoincrement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `Inv_ID_auto` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
