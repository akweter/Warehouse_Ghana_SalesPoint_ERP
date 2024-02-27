import React, { useState } from 'react';
import {
	IconButton,
	Collapse,
	Table,
	TableRow,
	TableCell,
	Typography,
	TableContainer,
	TableBody,
	TableHead,
	Paper,
	Box,
	Button,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ProductRow = ({ product }) => {
	const [open, setOpen] = useState(false);

	const openData = () => {
		setOpen(!open);
	}

	return (
		<>
			<TableRow>
				<TableCell padding='none'>
					<IconButton style={{ cursor: 'pointer' }} size="small" onClick={openData}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} component="th" scope="row" onClick={openData}>{product.name}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{product.price}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{product.status}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{product.sku}</TableCell>
			</TableRow>

			<TableRow>
				<TableCell padding='none' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size="small" style={{ marginLeft: 50 }}>
								<TableHead>
									<TableRow>
										<TableCell padding='none'>Date Added</TableCell>
										<TableCell padding='none'>{product.date_created}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Sales Counter</TableCell>
										<TableCell padding='none'>{product.total_sales}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Shipping Class</TableCell>
										<TableCell padding='none'>{product.shipping_class}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Tax Status</TableCell>
										<TableCell padding='none'>{product.tax_status}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Stock Status</TableCell>
										<TableCell padding='none'>{product.stock_status}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Category</TableCell>
										<TableCell padding='none'>{product.categories.map(e => e.name).join(', ')}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Tags</TableCell>
										<TableCell padding='none'>{product.tags.map(e => e.name).join(', ')}</TableCell>
									</TableRow>
								</TableHead>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

const ProductsTable = ({ products }) => {
    const itemsPerPage = 10;
	const [currentPage, setCurrentPage] = useState(1);

	const handleNextPage = () => {
		setCurrentPage(prevPage => prevPage + 1);
	};
	const handlePrevPage = () => {
		setCurrentPage(prevPage => prevPage - 1);
	};
	const renderData = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const currentPageData = products.slice(startIndex, endIndex);

		return currentPageData.map(data => (
			<ProductRow key={data.id} product={data} />
		));
	};

	return (
		<>
			<Box height={500} overflow='scroll'>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow style={{ backgroundColor: 'darkblue' }}>
								<TableCell><Typography variant='h4' color='white'>{products.length}</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Product Name</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Price</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Status</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>SKU</Typography></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{renderData()}
						</TableBody>
					</Table>
				</TableContainer>
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
			<Button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= products.length}>Next</Button>
			</Box>
		</>
	);
};

export default ProductsTable;
