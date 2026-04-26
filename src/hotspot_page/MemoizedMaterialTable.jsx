
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { createConsumer } from "@rails/actioncable";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";
import ReactApexChart from 'react-apexcharts';
import { 
  BarChart3, TrendingDown, Download, Upload,   
  Wifi, 
  Clock,
  Globe,
  Cpu,
  Activity,
 
} from 'lucide-react';
import MaterialTable from 'material-table'
import { MdOutlineWifi } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import EditPayment from '../edit/EditPayment'
import { IconButton, Tooltip} from '@mui/material';
import { IoEyeOutline } from "react-icons/io5";
import { 
  IoWarningOutline,
  IoCheckmarkCircleOutline 
} from 'react-icons/io5';

const MemoizedMaterialTable  = ({colum}) => {
  return (
    <div>
      
    </div>
  )
}


export default MemoizedMaterialTable
