// src/components/biendong/LichSuBienDong.tsx

import {
    Box,
    Paper,
    Typography,
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
    Chip,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Stack,
    Divider
} from '@mui/material';
import {
    ChildCare as BirthIcon,
    PersonOff as DeathIcon,
    FlightTakeoff as LeaveIcon,
    FlightLand as ArriveIcon,
    SwapHoriz as ChangeIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import type { BienDongNhanKhau } from '../../api/bienDongApi';
import { getLichSuBienDongByHoKhau, getLichSuBienDongByNhanKhau } from '../../api/bienDongApi';

interface LichSuBienDongProps {
    type: 'hoKhau' | 'nhanKhau';
    id: number;
    title?: string;
}

export default function LichSuBienDong({ type, id, title = 'Lịch sử biến động' }: LichSuBienDongProps) {
    const [lichSu, setLichSu] = useState<BienDongNhanKhau[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                let data: BienDongNhanKhau[] = [];
                if (type === 'hoKhau') {
                    data = await getLichSuBienDongByHoKhau(id);
                } else {
                    data = await getLichSuBienDongByNhanKhau(id);
                }

                setLichSu(data);
            } catch (err: any) {
                setError('Không thể tải lịch sử biến động');
                console.error('Error loading lich su bien dong:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [type, id]);

    const getIcon = (loaiBienDong: string) => {
        switch (loaiBienDong) {
            case 'KHAI_SINH':
                return <BirthIcon />;
            case 'KHAI_TU':
                return <DeathIcon />;
            case 'CHUYEN_DI':
                return <LeaveIcon />;
            case 'CHUYEN_DEN':
                return <ArriveIcon />;
            case 'THAY_DOI_CHU_HO':
            case 'THAY_DOI_KHAC':
                return <ChangeIcon />;
            default:
                return <InfoIcon />;
        }
    };

    const getColor = (loaiBienDong: string): 'primary' | 'error' | 'warning' | 'success' | 'info' => {
        switch (loaiBienDong) {
            case 'KHAI_SINH':
                return 'success';
            case 'KHAI_TU':
                return 'error';
            case 'CHUYEN_DI':
                return 'warning';
            case 'CHUYEN_DEN':
                return 'info';
            default:
                return 'primary';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    if (lichSu.length === 0) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Typography color="text.secondary" align="center">
                    Chưa có lịch sử biến động
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>

            <Timeline position="alternate">
                {lichSu.map((item, index) => (
                    <TimelineItem key={item.id}>
                        <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                            <Typography variant="body2" color="text.secondary">
                                {formatDate(item.ngayBienDong)}
                            </Typography>
                        </TimelineOppositeContent>

                        <TimelineSeparator>
                            <TimelineConnector sx={{ bgcolor: 'grey.400' }} />
                            <TimelineDot color={getColor(item.loaiBienDong)}>
                                {getIcon(item.loaiBienDong)}
                            </TimelineDot>
                            <TimelineConnector sx={{ bgcolor: 'grey.400' }} />
                        </TimelineSeparator>

                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Chip
                                                label={item.loaiBienDongDisplay}
                                                color={getColor(item.loaiBienDong)}
                                                size="small"
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {item.hoTenNhanKhau}
                                            </Typography>
                                        </Box>

                                        {item.cmndCccd && (
                                            <Typography variant="caption" color="text.secondary">
                                                CCCD: {item.cmndCccd}
                                            </Typography>
                                        )}

                                        {item.noiChuyen && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Nơi chuyển:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {item.noiChuyen}
                                                </Typography>
                                            </Box>
                                        )}

                                        {item.lyDo && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Lý do:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {item.lyDo}
                                                </Typography>
                                            </Box>
                                        )}

                                        {item.ghiChu && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Ghi chú:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {item.ghiChu}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Divider />

                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="caption" color="text.secondary">
                                                Người thực hiện: {item.nguoiThucHien}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(item.createdAt).toLocaleString('vi-VN')}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Paper>
    );
}