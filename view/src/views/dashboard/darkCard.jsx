import React, {  } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import TotalIncomeCard from '../../ui-component/cards/Skeleton/TotalIncomeCard';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import {
    BlackCardWrapperEffect,
    BlueCardWrapperEffect,
    GreenCardWrapperEffect,
    OrangeCardWrapperEffect,
    YellowCardWrapperEffect
} from 'ui-component/colorsCardWrapper';
import { formatCurrencyNumber } from 'utilities/formatAmount';
import { IconReceiptRefund, IconReportMoney } from '@tabler/icons';
import { Cancel, Discount } from '@mui/icons-material';

const CustomListItem = ({ avatarBackgroundColor, avatarIcon, primaryText, secondaryText }) => {
    const theme = useTheme();

    return (
        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
            <ListItemAvatar>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: avatarBackgroundColor,
                    }}
                >
                    {avatarIcon}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45
                }}
                primary={<Typography variant="h4">{primaryText}</Typography>}
                secondary={<Typography variant="h4">{secondaryText}</Typography>}
            />
        </ListItem>
    );
};

CustomListItem.propTypes = {
    avatarBackgroundColor: PropTypes.string.isRequired,
    avatarIcon: PropTypes.node.isRequired,
    primaryText: PropTypes.node.isRequired,
    secondaryText: PropTypes.node.isRequired,
};

const HomeDarkCard = ({ isLoading, invoices, refunds, cancelRefunds, }) => {
    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <Box
                    sx={{
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        display: 'grid',
                        flexDirection: 'row',
                        gridTemplateColumns: { md: '1.0fr 1.0fr 1.0fr 1.0fr  1.0fr' },
                    }}
                >
                    <OrangeCardWrapperEffect border={false} content={false}>
                        <Box sx={{ p: 1 }}>
                            <List sx={{ py: 0 }}>
                                <CustomListItem
                                    avatarBackgroundColor={theme.palette.background.default}
                                    avatarIcon={<LocalOfferOutlinedIcon fontSize="small" />}
                                    primaryText={`# ${invoices.length}`}
                                    secondaryText="Invoices Count"
                                />
                            </List>
                        </Box>
                    </OrangeCardWrapperEffect>
                    <YellowCardWrapperEffect border={false} content={false}>
                        <Box sx={{ p: 1 }}>
                            <List sx={{ py: 0 }}>
                                <CustomListItem
                                    avatarBackgroundColor={theme.palette.background.default}
                                    avatarIcon={< Discount />}
                                    primaryText={`¢${formatCurrencyNumber(invoices.reduce((e, invoice) => {
                                        return e + parseFloat(invoice.Inv_discount);
                                    }, 0).toFixed(2))}`}
                                    secondaryText="Today's Discounts"
                                />
                            </List>
                        </Box>
                    </YellowCardWrapperEffect>
                    <BlueCardWrapperEffect border={false} content={false}>
                        <Box sx={{ p: 1 }}>
                            <List sx={{ py: 0 }}>
                                <CustomListItem
                                    avatarBackgroundColor={theme.palette.background.default}
                                    avatarIcon={< IconReportMoney />}
                                    primaryText={`# ${refunds.length}`}
                                    secondaryText="Refunds Count"
                                />
                            </List>
                        </Box>
                    </BlueCardWrapperEffect>
                    <BlackCardWrapperEffect border={false} content={false}>
                        <Box sx={{ p: 1 }}>
                            <List sx={{ py: 0 }}>
                                <CustomListItem
                                    avatarBackgroundColor={theme.palette.background.default}
                                    avatarIcon={< IconReceiptRefund />}
                                    primaryText={`¢${formatCurrencyNumber(refunds.reduce((e, invoice) => {
                                        return e + parseFloat(invoice.Inv_total_amt);
                                    }, 0).toFixed(2))}`}
                                    secondaryText="Today Refunds "
                                />
                            </List>
                        </Box>
                    </BlackCardWrapperEffect>
                    <GreenCardWrapperEffect border={false} content={false}>
                        <Box sx={{ p: 1 }}>
                            <List sx={{ py: 0 }}>
                                <CustomListItem
                                    avatarBackgroundColor={theme.palette.background.default}
                                    avatarIcon={< Cancel color='error'/>}
                                    primaryText={`¢${formatCurrencyNumber(cancelRefunds.reduce((e, invoice) => {
                                        return e + parseFloat(invoice.Inv_total_amt);
                                    }, 0).toFixed(2))}`}
                                    secondaryText="Cancelled Refunds"
                                />
                            </List>
                        </Box>
                    </GreenCardWrapperEffect>
                </Box>
            )}
        </>
    );
};

HomeDarkCard.propTypes = {
    isLoading: PropTypes.bool
};
export default HomeDarkCard;
