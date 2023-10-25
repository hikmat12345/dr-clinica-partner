import * as React from "react";
// #FOLD_BLOCK
import {
  ViewState,
  GroupingState,
  IntegratedGrouping,
} from "@devexpress/dx-react-scheduler";
// #FOLD_BLOCK
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AllDayPanel,
  AppointmentTooltip,
  GroupingPanel,
  Resources,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import configData from "../../utils/constants/config.json";
import { connectProps } from "@devexpress/dx-react-core";
import { styled, alpha } from "@mui/material/styles";
import PriorityHigh from "@mui/icons-material/PriorityHigh";
import LowPriority from "@mui/icons-material/LowPriority";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Event from "@mui/icons-material/Event";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import classNames from "clsx";
import { priorities } from "./tasks";
import { data as tasks } from "./grouping";
import axiosClient from "../../utils/helpers/server";
import swal from "sweetalert";
import { useLocation, useNavigate } from "react-router-dom";
import { InputLabel } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { API } from "../../Pages/AddAppointment/API";
import { getDayName, getDayTime } from "../../utls";
const grouping = [
  {
    resourceName: "priorityId",
  },
];
const selectedDate = new URLSearchParams(window?.location?.search)?.get(
  "selectedDate"
);
const bookingId = new URLSearchParams(window?.location?.search)?.get(
  "bookingId"
);
const durvalue = new URLSearchParams(window?.location?.search)?.get("durvalue");
const customerId = new URLSearchParams(window?.location?.search)?.get(
  "customerId"
);
const teammemeber = new URLSearchParams(window?.location?.search)?.get(
  "teammemeber"
);
const branchValueFromUrl = new URLSearchParams(window?.location?.search)?.get(
  "branchValueFromUrl"
);

const filterTasks = (items, priorityId) => {
   priorityId = priorityId == 99 ? 0 : priorityId;
  return items.filter((task) => !priorityId || task.priorityId === priorityId);
};

const getIconById = (id) => {
  if (id === 1) {
    return LowPriority;
  }
  if (id === 2) {
    return Event;
  }
  return PriorityHigh;
};

const PREFIX = "Demo";
// #FOLD_BLOCK
const classes = {
  flexibleSpace: `Demo-flexibleSpace`,
  prioritySelector: `Demo-prioritySelector`,
  content: `Demo-content`,
  contentContainer: `Demo-contentContainer`,
  text: `Demo-text`,
  title: `Demo-title`,
  icon: `Demo-icon`,
  contentItemIcon: `Demo-contentItemIcon`,
  grayIcon: `Demo-grayIcon`,
  colorfulContent: `Demo-colorfulContent`,
  lens: `Demo-lens`,
  textCenter: `Demo-textCenter`,
  dateAndTitle: `Demo-dateAndTitle`,
  titleContainer: `Demo-titleContainer`,
  container: `Demo-container`,
  bullet: `Demo-bullet`,
  prioritySelectorItem: `Demo-prioritySelectorItem`,
  priorityText: `Demo-priorityText`,
  priorityShortText: `Demo-priorityShortText`,
  cellLowPriority: `Demo-cellLowPriority`,
  cellMediumPriority: `Demo-cellMediumPriority`,
  cellHighPriority: `Demo-cellHighPriority`,
  headerCellLowPriority: `Demo-headerCellLowPriority`,
  headerCellMediumPriority: `Demo-headerCellMediumPriority`,
  headerCellHighPriority: `Demo-headerCellHighPriority`,
};
// #FOLD_BLOCK
const stylesByPriority = "";
// #FOLD_BLOCK
const groupingStyles = ({ theme }) => ({
  [`&.${classes.cellLowPriority}`]: stylesByPriority.cellLowPriority,
  [`&.${classes.cellMediumPriority}`]: stylesByPriority.cellMediumPriority,
  [`&.${classes.cellHighPriority}`]: stylesByPriority.cellHighPriority,
  [`&.${classes.headerCellLowPriority}`]:
    stylesByPriority.headerCellLowPriority,
  [`&.${classes.headerCellMediumPriority}`]:
    stylesByPriority.headerCellMediumPriority,
  [`&.${classes.headerCellHighPriority}`]:
    stylesByPriority.headerCellHighPriority,
  [`& .${classes.icon}`]: {
    paddingLeft: theme.spacing(1),
    verticalAlign: "middle",
  },
});

// #FOLD_BLOCK
const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    margin: "0 auto 0 0",
    backgroundColor: "#f2f2f7",
    boxShadow: "none",
  },
  [`&.css-1b7ni76-MuiToolbar-root`]: {
    backgroundColor: "#f2f2f7",
  },
}));

const StyledFormControl = styled(FormControl)(({ theme: { spacing } }) => ({
  [`&.${classes.prioritySelector}`]: {
    minWidth: 140,
    marginLeft: spacing(2),
    "@media (max-width: 500px)": {
      minWidth: 0,
      fontSize: "0.75rem",
      marginLeft: spacing(0.5),
    },
  },
}));

// #FOLD_BLOCK
const StyledPrioritySelectorItem = styled("div")(
  ({ theme: { palette, spacing }, color }) => ({
    [`& .${classes.bullet}`]: {
      backgroundColor: "red",
      borderRadius: "50%",
      width: spacing(2),
      height: spacing(2),
      marginRight: spacing(2),
      display: "inline-block",
    },
    [`&.${classes.prioritySelectorItem}`]: {
      display: "flex",
      alignItems: "center",
    },
    [`& .${classes.priorityText}`]: {
      "@media (max-width: 500px)": {
        display: "none",
      },
    },
    [`& .${classes.priorityShortText}`]: {
      "@media (min-width: 500px)": {
        display: "none",
      },
    },
  })
);
// #FOLD_BLOCK
const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(
  groupingStyles
);
// #FOLD_BLOCK
const StyledTooltipContent = styled("div")(
  ({ theme: { spacing, typography, palette }, color }) => ({
    [`&.${classes.content}`]: {
      padding: spacing(3, 1),
      paddingTop: 0,
      backgroundColor: palette.background.paper,
      boxSizing: "border-box",
      width: "300px",
    },
    [`& .${classes.contentContainer}`]: {
      paddingBottom: spacing(1.5),
    },
    [`& .${classes.text}`]: {
      ...typography.body2,
      display: "inline-block",
    },
    [`& .${classes.title}`]: {
      ...typography.h6,
      color: palette.text.secondary,
      fontWeight: typography.fontWeightBold,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "normal",
    },
    [`& .${classes.icon}`]: {
      verticalAlign: "middle",
    },
    [`& .${classes.contentItemIcon}`]: {
      textAlign: "center",
    },
    [`& .${classes.grayIcon}`]: {
      color: palette.action.active,
    },
    [`& .${classes.colorfulContent}`]: {
      color: color[300],
    },
    [`& .${classes.lens}`]: {
      width: spacing(4.5),
      height: spacing(4.5),
      verticalAlign: "super",
    },
    [`& .${classes.textCenter}`]: {
      textAlign: "center",
    },
    [`& .${classes.dateAndTitle}`]: {
      lineHeight: 1.1,
    },
    [`& .${classes.titleContainer}`]: {
      paddingBottom: spacing(2),
    },
    [`& .${classes.container}`]: {
      paddingBottom: spacing(1.5),
    },
  })
);

// #FOLD_BLOCK
const StyledDayViewDayScaleCell = styled(DayView.DayScaleCell)(groupingStyles);

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(
  groupingStyles
);

const StyledAllDayPanelCell = styled(AllDayPanel.Cell)(groupingStyles);

const StyledGroupingPanelCell = styled(GroupingPanel.Cell)(groupingStyles);

const StyledDayViewTimeTableCell = styled(DayView.TimeTableCell)(
  groupingStyles
);
const DayViewTimeTableCell = ({ groupingInfo, ...restProps }) => {
  const groupId = groupingInfo[0].id;
  const location = useLocation();
  const history = useNavigate();
  const onDoubleClick = () => {
    var todayDate = new Date(); 
    var dateToCheck = new Date(restProps?.startDate);   
      // Compare the dateToCheck with today's date
      if (dateToCheck < todayDate) {
           toast.info(`You can't select passed date/time. Try to select from now.`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
         return 
      }  
      const dateStart = new Date(restProps?.startDate);
      let starthour = dateStart?.getHours(); // get the hours from the date object
      
    let teamArr = localStorage.getItem("teams");
    teamArr = JSON.parse(teamArr) || [];
    const getDayn = getDayName(restProps?.startDate);
    const workingHours =teamArr.filter((obj)=>obj.id==groupingInfo[0].id)[0]?.workinghour
     const foundObject = workingHours.find(obj => obj.day.toLowerCase() === getDayn.toLowerCase());

    const starttimeDoctor = parseInt(foundObject.starttime.split(":")[0]);
    const endtimeDoctor = parseInt(foundObject.endtime.split(":")[0]);
    const isHolidayDoctor = foundObject.isholiday === 1; // Assuming 1 represents true for isholiday

    if ((starthour >= starttimeDoctor && starthour <= endtimeDoctor)) {
    
    } else if (isHolidayDoctor){
      toast.info(`Provider is on holiday.`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });  
        return
    } else {
      toast.info(`Provider not available at this time.`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        }); 
        return   
      }


     const madeDate = `${restProps?.startDate?.getFullYear()}-${
            (restProps?.startDate?.getMonth() + 1).toString().length == 1
              ? "0" + (restProps?.startDate?.getMonth() + 1)
              : restProps?.startDate?.getMonth()
          }-${
            (restProps?.startDate?.getDate() + 1).toString().length == 1
              ? "0" + restProps?.startDate?.getDate()
              : restProps?.startDate?.getDate()
          }`;

    if (bookingId && teammemeber) {
      
      const startminute =
        restProps?.startDate?.getMinutes() == 0
          ? "00"
          : restProps?.startDate?.getMinutes();
      
      if (Number(teammemeber) !== groupingInfo[0].id) {
        toast(`You can't Reschedule appointment for other provider`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        API({
          method: "POST",
          url: "partner/appointment/reschedule-appointment",
          contentType: "application/json",
          payload: JSON.stringify({
            serviceProviderId: groupingInfo[0].id,
            date: madeDate,
            starttime: starthour + ":" + startminute,
            duration: Number(durvalue),
            bookingId: Number(bookingId),
            customer: Number(customerId),
            branch: teamArr[0].branch,
          }),
        }).then((resp) => {
          if (Object.keys(resp)[0] == 400) {
            swal({
              title: "We are sorry.",
              text: resp[Object.keys(resp)[0]],
              icon: "warning",
              button: "ok",
            });
          } else {
            toast.success("Your appointment is Reschedule successfuly", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setTimeout(() => {
              window.location.href = "/calendar?selectedDate=" + selectedDate;
            }, 2000);
          }
        });
      }
    } else {
 
      API({
        method: "POST",
        url: "partner/slots/checktimeslot",
        contentType: "application/json",
        payload: JSON.stringify({
          serviceprovider: groupingInfo[0].id,
          bookingdate: madeDate,
          business: Number(localStorage.getItem("bussinessId")),
          branch: teamArr[0].branch,
        })}).then((resp) => {
           if (Object.keys(resp)[0] == 200) {
            history("/calendar/addappointment", {
              state: {
                ...groupingInfo[0],
                ...restProps,
                branchId: teamArr[0].branch,
               },
            });
          } else {
            toast(`${resp[Object.keys(resp)[0]]}`, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } 
        })
 
    }
  };
  return (
    <>
      <StyledDayViewTimeTableCell
        onClick={onDoubleClick}
        style={{ cursor: bookingId && "pointer" }}
        groupingInfo={{ ...groupingInfo, text: "" }}
        {...restProps}
      />
    </>
  );
};

const StyledThreeDayViewTimeTableCell = styled(DayView.TimeTableCell)(
  groupingStyles
);

const ThreeDayViewTimeTableCell = ({ groupingInfo, ...restProps }) => {
  const groupId = groupingInfo[0].id;
  const history = useNavigate();
  const onDoubleClick = () => {
    var todayDate = new Date(); 
    var dateToCheck = new Date(restProps?.startDate);   
      // Compare the dateToCheck with today's date
      if (dateToCheck < todayDate) {
           toast.info(`You can't select passed date/time. Try to select from today`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
         
        return 
      }
    let teamArr = localStorage.getItem("teams");
    teamArr = JSON.parse(teamArr) || [];
     const madeDate = `${restProps?.startDate?.getFullYear()}-${
            (restProps?.startDate?.getMonth() + 1).toString().length == 1
              ? "0" + (restProps?.startDate?.getMonth() + 1)
              : restProps?.startDate?.getMonth()
          }-${
            (restProps?.startDate?.getDate() + 1).toString().length == 1
              ? "0" + restProps?.startDate?.getDate()
              : restProps?.startDate?.getDate()
          }`;

    if (bookingId && teammemeber) {
      
      const startminute =
        restProps?.startDate?.getMinutes() == 0
          ? "00"
          : restProps?.startDate?.getMinutes();
      const dateStart = new Date(restProps?.startDate);
      let starthour = dateStart?.getHours(); // get the hours from the date object
      starthour = starthour; 
      if (Number(teammemeber) !== groupingInfo[0].id) {
        toast(`You can't Reschedule appointment for other provider`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        API({
          method: "POST",
          url: "partner/appointment/reschedule-appointment",
          contentType: "application/json",
          payload: JSON.stringify({
            serviceProviderId: groupingInfo[0].id,
            date: madeDate,
            starttime: starthour + ":" + startminute,
            duration: Number(durvalue),
            bookingId: Number(bookingId),
            customer: Number(customerId),
            branch: teamArr[0].branch,
          }),
        }).then((resp) => {
          if (Object.keys(resp)[0] == 400) {
            swal({
              title: "We are sorry.",
              text: resp[Object.keys(resp)[0]],
              icon: "warning",
              button: "ok",
            });
          } else {
            toast.success("Your appointment is Reschedule successfuly", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setTimeout(() => {
              window.location.href = "/calendar?selectedDate=" + selectedDate;
            }, 2000);
          }
        });
      }
    } else {
 
      API({
        method: "POST",
        url: "partner/slots/checktimeslot",
        contentType: "application/json",
        payload: JSON.stringify({
          serviceprovider: groupingInfo[0].id,
          bookingdate: madeDate,
          business: localStorage.getItem("bussinessId"),
          branch: teamArr[0].branch,
        })}).then((resp) => {
           if (Object.keys(resp)[0] == 200) {
            history("/calendar/addappointment", {
              state: {
                ...groupingInfo[0],
                ...restProps,
                branchId: teamArr[0].branch,
               },
            });
          } else {
            toast(`${resp[Object.keys(resp)[0]]}`, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } 
        })
 
    }
  };
  return (
    <StyledThreeDayViewTimeTableCell
      style={{ cursor: bookingId && "pointer" }}
      onClick={onDoubleClick}
      className={classNames({
        [classes.cellLowPriority]: groupId === 1,
        [classes.cellMediumPriority]: groupId === 2,
        [classes.cellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
};
// #FOLD_BLOCK
const DayViewDayScaleCell = ({
  groupingInfo,
  ...restProps
  // #FOLD_BLOCK
}) => {
  const groupId = groupingInfo[0].id;
  return (
    <StyledDayViewDayScaleCell
      style={{
        cursor: bookingId && "pointer",
      }}
      className={classNames({
        [classes.headerCellLowPriority]: groupId === 1,
        [classes.headerCellMediumPriority]: groupId === 2,
        [classes.headerCellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
};
// #FOLD_BLOCK
const WeekViewTimeTableCell = ({
  groupingInfo,
  ...restProps
  // #FOLD_BLOCK
}) => {
  const history = useNavigate();
  const onDoubleClick = () => {
    var todayDate = new Date(); 
    var dateToCheck = new Date(restProps?.startDate);   
      // Compare the dateToCheck with today's date
      if (dateToCheck < todayDate) {
           toast.info(`You can't select passed date/time. Try to select from today`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
         
        return 
      }
    let teamArr = localStorage.getItem("teams");
    teamArr = JSON.parse(teamArr) || [];
     const madeDate = `${restProps?.startDate?.getFullYear()}-${
            (restProps?.startDate?.getMonth() + 1).toString().length == 1
              ? "0" + (restProps?.startDate?.getMonth() + 1)
              : restProps?.startDate?.getMonth()
          }-${
            (restProps?.startDate?.getDate() + 1).toString().length == 1
              ? "0" + restProps?.startDate?.getDate()
              : restProps?.startDate?.getDate()
          }`;

    if (bookingId && teammemeber) {
      
      const startminute =
        restProps?.startDate?.getMinutes() == 0
          ? "00"
          : restProps?.startDate?.getMinutes();
      const dateStart = new Date(restProps?.startDate);
      let starthour = dateStart?.getHours(); // get the hours from the date object
      starthour = starthour; 
      if (Number(teammemeber) !== groupingInfo[0].id) {
        toast(`You can't Reschedule appointment for other provider`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        API({
          method: "POST",
          url: "partner/appointment/reschedule-appointment",
          contentType: "application/json",
          payload: JSON.stringify({
            serviceProviderId: groupingInfo[0].id,
            date: madeDate,
            starttime: starthour + ":" + startminute,
            duration: Number(durvalue),
            bookingId: Number(bookingId),
            customer: Number(customerId),
            branch: teamArr[0].branch,
          }),
        }).then((resp) => {
          if (Object.keys(resp)[0] == 400) {
            swal({
              title: "We are sorry.",
              text: resp[Object.keys(resp)[0]],
              icon: "warning",
              button: "ok",
            });
          } else {
            toast.success("Your appointment is Reschedule successfuly", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setTimeout(() => {
              window.location.href = "/calendar?selectedDate=" + selectedDate;
            }, 2000);
          }
        });
      }
    } else {
 
      API({
        method: "POST",
        url: "partner/slots/checktimeslot",
        contentType: "application/json",
        payload: JSON.stringify({
          serviceprovider: groupingInfo[0].id,
          bookingdate: madeDate,
          business: localStorage.getItem("bussinessId"),
          branch: teamArr[0].branch,
        })}).then((resp) => {
           if (Object.keys(resp)[0] == 200) {
            history("/calendar/addappointment", {
              state: {
                ...groupingInfo[0],
                ...restProps,
                branchId: teamArr[0].branch,
               },
            });
          } else {
            toast(`${resp[Object.keys(resp)[0]]}`, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } 
        })
 
    }
  };
  const groupId = groupingInfo[0].id;
  return (
    <StyledWeekViewTimeTableCell
      style={{
        cursor: bookingId && "pointer",
      }}
      onClick={onDoubleClick}
      className={classNames({
        [classes.cellLowPriority]: groupId === 1,
        [classes.cellMediumPriority]: groupId === 2,
        [classes.cellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
};

// #FOLD_BLOCK
const WeekViewDayScaleCell = ({
  groupingInfo,
  ...restProps
  // #FOLD_BLOCK
}) => {
  const groupId = groupingInfo[0].id;
  const history = useNavigate();

  const onDoubleClick = () => {
    var todayDate = new Date(); 
    var dateToCheck = new Date(restProps?.startDate);   
      // Compare the dateToCheck with today's date
      if (dateToCheck < todayDate) {
           toast.info(`You can't select passed date/time. Try to select from today`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
         
        return 
      }
    let teamArr = localStorage.getItem("teams");
    teamArr = JSON.parse(teamArr) || [];
     const madeDate = `${restProps?.startDate?.getFullYear()}-${
            (restProps?.startDate?.getMonth() + 1).toString().length == 1
              ? "0" + (restProps?.startDate?.getMonth() + 1)
              : restProps?.startDate?.getMonth()
          }-${
            (restProps?.startDate?.getDate() + 1).toString().length == 1
              ? "0" + restProps?.startDate?.getDate()
              : restProps?.startDate?.getDate()
          }`;

    if (bookingId && teammemeber) {
      
      const startminute =
        restProps?.startDate?.getMinutes() == 0
          ? "00"
          : restProps?.startDate?.getMinutes();
      const dateStart = new Date(restProps?.startDate);
      let starthour = dateStart?.getHours(); // get the hours from the date object
      starthour = starthour; 
      if (Number(teammemeber) !== groupingInfo[0].id) {
        toast(`You can't Reschedule appointment for other provider`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        API({
          method: "POST",
          url: "partner/appointment/reschedule-appointment",
          contentType: "application/json",
          payload: JSON.stringify({
            serviceProviderId: groupingInfo[0].id,
            date: madeDate,
            starttime: starthour + ":" + startminute,
            duration: Number(durvalue),
            bookingId: Number(bookingId),
            customer: Number(customerId),
            branch: teamArr[0].branch,
          }),
        }).then((resp) => {
          if (Object.keys(resp)[0] == 400) {
            swal({
              title: "We are sorry.",
              text: resp[Object.keys(resp)[0]],
              icon: "warning",
              button: "ok",
            });
          } else {
            toast.success("Your appointment is Reschedule successfuly", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setTimeout(() => {
              window.location.href = "/calendar?selectedDate=" + selectedDate;
            }, 2000);
          }
        });
      }
    } else {
 
      API({
        method: "POST",
        url: "partner/slots/checktimeslot",
        contentType: "application/json",
        payload: JSON.stringify({
          serviceprovider: groupingInfo[0].id,
          bookingdate: madeDate,
          business: localStorage.getItem("bussinessId"),
          branch: teamArr[0].branch,
        })}).then((resp) => {
           if (Object.keys(resp)[0] == 200) {
            history("/calendar/addappointment", {
              state: {
                ...groupingInfo[0],
                ...restProps,
                branchId: teamArr[0].branch,
               },
            });
          } else {
            toast(`${resp[Object.keys(resp)[0]]}`, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } 
        })
 
    }
  };
  return (
    <StyledWeekViewDayScaleCell
      style={{ cursor: bookingId && "pointer" }}
      onClick={onDoubleClick}
      className={classNames({
        [classes.headerCellLowPriority]: groupId === 1,
        [classes.headerCellMediumPriority]: groupId === 2,
        [classes.headerCellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
};
// #FOLD_BLOCK
const AllDayCell = ({
  groupingInfo,
  ...restProps
  // #FOLD_BLOCK
}) => {
  const groupId = groupingInfo[0].id;
  return (
    <StyledAllDayPanelCell
      className={classNames({
        [classes.cellLowPriority]: groupId === 1,
        [classes.cellMediumPriority]: groupId === 2,
        [classes.cellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
};
// #FOLD_BLOCK
const GroupingPanelCell = ({
  group,
  ...restProps
  // #FOLD_BLOCK
}) => {
  const groupId = group.id;
  const Icon = getIconById(groupId);
  const history = useNavigate();
  const onDoubleClick = () => {
    window.location.href = `/team/editteammember?memberid=${group.id}`;
  };
  let teamArr = localStorage.getItem("teams");
  teamArr = JSON.parse(teamArr) || [];
  teamArr = teamArr !== null && teamArr?.filter((obj) => obj.id == group.id);
  teamArr = teamArr[0]?.profileimage;
  return (
    <StyledGroupingPanelCell
      className={classNames({})}
      group={{ ...group, text: "" }}
      {...restProps}
    >
      <div
        className="flex flex-wrap justify-center"
        style={{
          cursor: "pointer",
        }}
        onClick={onDoubleClick}
      >
        <div className="w-28 px-4">
          <img
            src={
              teamArr
                ? teamArr
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr1bUmKKii0o6miVz1u54dco7zuViHzACGzcvh0s66sA&s"
            }
            alt="..."
            className=" providerimage shadow rounded-full max-w-full h-auto align-middle border-solid border-4 border-indigo-100"
          />
        </div>
      </div>
      {group?.text !== "Priority" && (
        <div
          style={{
            color: "black",
          }}
        >
          {group?.text?.split("+")[0]}
        </div>
      )}
    </StyledGroupingPanelCell>
  );
};

const PrioritySelectorItem = ({ color, text: resourceTitle }) => {
  let getSelectedProvider = localStorage.getItem("selectedProviderName");
  const text = getSelectedProvider || "All";
  const shortText = getSelectedProvider || "All";
  return (
    <div
      className={classes.prioritySelectorItem}
      color={color || ""}
      text={getSelectedProvider}
    >
      <span className={classes.priorityText}>{text}</span>
    </div>
  );
};

const PrioritySelector = ({ priorityChange, priority, prioritiesData }) => {
  let teamArr = localStorage.getItem("teams");
  teamArr = JSON.parse(teamArr) || [];
  let selectedProviderName = localStorage.getItem("selectedProviderName");
  const currentPriority = priority > 0 ? teamArr[priority - 1] : {};
  teamArr = [{ id: 99, text: "All", color: "" }, ...teamArr];
  return (
    <StyledFormControl className={classes.prioritySelector} variant="standard">
      <Select
        disableUnderline
        value={priority}
        onChange={(e) => { 
          priorityChange(e.target.value);
        }}
        renderValue={() => {
          return (
            <PrioritySelectorItem
              text={currentPriority?.text}
              color={
                currentPriority?.color == undefined
                  ? ""
                  : currentPriority?.color
              }
            />
          );
        }}
      >
        {teamArr?.map(({ id, color, text }) => (
          <MenuItem value={id} key={id.toString()}>
            <div style={{ display: "none" }}>
              <PrioritySelectorItem
                color={color == undefined ? "" : color}
                text={text}
              />
            </div>
            {text}
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
};

const FlexibleSpace = ({
  priority,
  priorityChange,
  prioritiesProvider,
  ...restProps
}) => {
  return (
    <StyledToolbarFlexibleSpace
      {...restProps}
      className={classes.flexibleSpace}
    >
      <PrioritySelector
        priority={priority}
        priorityChange={priorityChange}
        prioritiesData={prioritiesProvider}
      />
    </StyledToolbarFlexibleSpace>
  );
};
// #FOLD_BLOCK
const TooltipContent = ({
  appointmentData,
  formatDate,
  appointmentResources,
  // #FOLD_BLOCK
}) => {
  const resource = appointmentResources[0];
  const history = useNavigate();
  const viewAppointemtn = () => {
    history(`/calendar/viewappointment/${appointmentData?.id}`, {
      state: {},
    });
  };
  return (
    <StyledTooltipContent
      onClick={viewAppointemtn}
      className={classes.content}
      color={resource.color}
    >
      <Grid
        container
        alignItems="flex-start"
        className={classes.titleContainer}
      >
        <Grid item xs={2} className={classNames(classes.textCenter)}>
          {/* <Lens className={classNames(classes.lens, classes.colorfulContent)} /> */}
        </Grid>
        <Grid item xs={10}>
          <div className="notest cursor-pointer">
            <div>{appointmentData?.title}</div>
            <div className="notest">{}</div>
          </div>
        </Grid>

        <Grid item xs={2} className={classNames(classes.textCenter)}></Grid>
        <Grid item xs={10}>
          <div>
            <div className="notest cursor-pointer">
              View <RemoveRedEyeIcon />
            </div>
          </div>
        </Grid>
      </Grid>
    </StyledTooltipContent>
  );
};

// add appointment btn
export const AddAppointmentBTN = ({ data }) => {
  const history = useNavigate();
  const AddAppointmentHandler = () => {
    history("/calendar/addappointment", {
      state: {
        ...data,
        startDate: data?.dateStart,
        branchId: data.branchId,
      },
    });
  };
  return (
    <button
      style={{ backgroundColor: "black", color: "white" }}
      className="btn space-x-2 bg-slate-150 bg-black font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
      onClick={AddAppointmentHandler}
    >
      Add Appointment
    </button>
  );
};
export default class Calendar extends React.PureComponent {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      currentDate: selectedDate
        ? selectedDate
        : `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
      startingHour: 9,
      endingHour: 22,
      BranchidForBtn: 0,
      items: [],
      filteredArray: [],
      scheduledFilterArray: [],
      selectedOption: false,
      // filteredItems: [],
      bookingsList: [],
      teamemeberList: [],
      currentViewName: "Day",
      data: tasks,
      currentPriority: 0,
      prioritiesPro: [],
      loader: false,
      isHoliday:false,
      holidays:[],
      branchValueFromUrl: branchValueFromUrl,
      branchList: [],
      branchValue: 0,
      allProviderStatus: false,
      appointmentStatusEl: null,
      resources: [
        {
          fieldName: "priorityId",
          title: "Priority",
          instances: priorities,
        },
      ],
    };

    this.currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName });
    };

    this.priorityChange = (value) => {
       const { resources, prioritiesPro } = this.state;

      let teamArr = localStorage.getItem("teams");
      teamArr = JSON.parse(teamArr) || [];
      const updateTeam = [
        { id: 99, text: "All", color: "", firstname: "All" },
        ...teamArr,
      ];
      const nextResources = [
        {
          ...resources[0],
          instances:
            value !== 99 && value > 0
              ? teamArr.filter((obj) => obj.id == value)
              : teamArr,
        },
      ];
      localStorage.setItem(
        "selectedProviderName",
        value !== 99 && value > 0
          ? teamArr.filter((obj) => obj.id == value)[0].firstname
          : "All"
      );
      this.setState({
        currentPriority: value,
        resources: nextResources,
        allProviderStatus: value == 99 ? true : this.state.allProviderStatus,
      });
    };
    this.flexibleSpace = connectProps(FlexibleSpace, () => {
      const { currentPriority, prioritiesPro } = this.state;
      return {
        priority: currentPriority,
        priorityChange: this.priorityChange,
        prioritiesProvider: prioritiesPro,
      };
    });
  }

  componentDidMount() {
    localStorage.removeItem("selectedProviderName");
    localStorage.removeItem("teams");
    this.getAppointments(
      new Date(this.state.currentDate),
      this.state.branchValue
    );
    // Branch list
    axiosClient
      .get(configData.SERVER_URL + `partner/businesssetup/getBranches`)
      .then((resp) => {
        this.setState({ branchList: resp.data?.branches });
        this.setState({
          branchValue: this.state.branchValueFromUrl
            ? this.state.branchValueFromUrl
            : resp.data?.branches[0]?.id,
        });
        this.teamMemberHandler(
          this.state.branchValueFromUrl
            ? this.state.branchValueFromUrl
            : resp.data?.branches[0]?.id
        );
      })
      .catch(() => {});

      document.getElementById("toptheme-btn").style.display="none"
  }
  componentWillUnmount() {
    document.getElementById("toptheme-btn").style.display="initial"
  }
  changeBranch = (value) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("branchValueFromUrl", value);
    window.location.search = urlParams;
    this.setState({ branchValue: value });
    this.teamMemberHandler(value);
    this.getAppointments(new Date(this.state.currentDate), value);
  };

  currentDateChange = (currentDate) => {
    this.setState({ currentDate });
    this.getAppointments(currentDate, this.state.branchValue);
  };
  // axios call

  teamMemberHandler(branchIdArg) {
    this.setState({ loader: true });
    axiosClient
      .get(
        configData.SERVER_URL +
          `partner/team/teammember-by-branch-id/${
            branchIdArg ? branchIdArg : this.state.branchValue
          }?page=1&count=50`
      )
      .then((resp) => {
        localStorage.removeItem(
          "teams",)
        localStorage.setItem(
          "teams",
          JSON.stringify(
            resp.data?.teammember?.map((obj) => ({
              ...obj,
              text: obj.firstname,
              branchId: branchIdArg ? branchIdArg : this.state.branchValue,
            }))
          )
        );
        this.setState({
          resources: [
            {
              fieldName: "priorityId",
              title: "Priority",
              instances: resp.data?.teammember?.map((obj) => ({
                ...obj,
                text: obj.firstname,
                // color:   '#ff0000' ,
                branchId: branchIdArg ? branchIdArg : this.state.branchValue,
              })),
            },
          ],
          prioritiesPro: resp.data?.teammember?.map((obj) => ({
            ...obj,
            text: obj.firstname,
            branchId: this.state.branchValue,
            teamMemberImg: obj?.image,
          })),
          loader: false,
        });
      });
  }
  getAppointments(currentDate, updatedBranchId) {
    this.setState({ loader: true });
    const doMakeCreateDate = `${currentDate.getFullYear()}-${
      (currentDate.getMonth() + 1).toString().length == 1
        ? "0" + (currentDate.getMonth() + 1)
        : currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
    let makeStartDate = new Date(doMakeCreateDate); // Replace with your desired start date
    makeStartDate = new Date(
      makeStartDate.getFullYear(),
      makeStartDate.getMonth(),
      makeStartDate.getDate() + 7
    );
    const makeEndDate = makeStartDate.toISOString().slice(0, 10);
    axiosClient
      .get(
        `partner/calendar/getcalendarpreloaddata/${doMakeCreateDate}?startDate=${doMakeCreateDate}&endDate=${makeEndDate}${
          updatedBranchId !== 0 ? "&branchId=" + updatedBranchId : ""
        }`
      )
      .then((resp) => {
        this.setState({ loader: false });
        if (parseInt(Object.keys(resp.data)) === 200) {
          let startingHour = new Date(
            `${currentDate.getFullYear()}-${
              currentDate.getMonth() + 1
            }-${currentDate.getDate()} 09:00`
          ).getTime();
          let endingHour = new Date(
            `${currentDate.getFullYear()}-${
              currentDate.getMonth() + 1
            }-${currentDate.getDate()} 18:00 `
          ).getTime();
          let data = [];
          let rows = [];
          let items = [];
          let providerCreationData = [];
          let filterProvider = {};
          this.setState({
            BranchidForBtn: resp?.data?.bookings[0]?.branch
              ? resp?.data?.bookings[0]?.branch
              : resp?.data?.branches[0]?.id,
          });

          const rescheduleBrdata = resp?.data?.branches.filter((obj) =>
            obj.id == updatedBranchId
              ? updatedBranchId
              : resp?.data?.branches[0]?.id
          )[0]?.branchtiming;
          const getDayn = getDayName(currentDate);
          const dayStatEndTime = getDayTime(getDayn, rescheduleBrdata);
          const holidayDays = rescheduleBrdata.filter(day => day.isholiday === 1).map(day => day.day);
          const dayMap = {
            "Sunday": 0,
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
            "Thursday": 4,
            "Friday": 5,
            "Saturday": 6
          };
          
          const holidayNumbers = holidayDays.map(day => dayMap[day]);
          // Example usage
          localStorage.setItem(
            "bussinessId",
            resp?.data?.branches[0]?.business
          );
           if(dayStatEndTime.startTime==0 ){
            document.querySelector(".MainLayout-container").style.display="none"
            document.querySelector(".Container-container").style.height="1px"
                 this.setState({
                  holidays:holidayNumbers,
                  isHoliday:true,
                  startingHour: 10,
                  endingHour: 22,
                });
              } else {
                
              this.setState({
                isHoliday:false,
                holidays:holidayNumbers,
                startingHour: Number(dayStatEndTime.startTime),
                endingHour: Number(dayStatEndTime.endTime),
              });
              const element = document.querySelector(".MainLayout-container");
                  if (element) {
                    if (!element.style) {
                      element.setAttribute("style", "display: initial;");
                    } else {
                      element.style.display = "initial";
                    }
                  }

                  const containerElement = document.querySelector(".Container-container");
                  if (containerElement) {
                    if (!containerElement.style) {
                      containerElement.setAttribute("style", "height: 627px;");
                    } else {
                      containerElement.style.height = "627px";
                    }
                  }
             }

          resp.data.bookings.forEach((booking) => {
            const bookingDate = new Date(booking.date);

            if (booking?.teammember !== null && booking.status !== 3) {
              startingHour = new Date(
                `${currentDate.getFullYear()}-${
                  currentDate.getMonth() + 1
                }-${currentDate.getDate()} ${booking.starttime}`
              ).getTime();
              endingHour = new Date(
                `${currentDate.getFullYear()}-${
                  currentDate.getMonth() + 1
                }-${currentDate.getDate()} ${booking.endtime}`
              ).getTime();

              let starttime = booking.starttime.split(":");
              let endtime = booking.endtime.split(":");
              let dateValue = new Date(booking.date);

              data.push({
                title: (
                  <div
                    className="appointmentStatus"
                    data-status={booking.status}
                    id={
                      booking?.service_bookingsToservice
                        ?.category_categoryToservice?.color
                    }
                  >
                    <div
                      className="ca-tooltip"
                      data-categorycolor={
                        booking?.service_bookingsToservice
                          ?.category_categoryToservice?.color
                      }
                    >
                      {booking?.customer_bookingsTocustomer?.firstname}{" "}
                      {booking?.customer_bookingsTocustomer?.lastname}
                    </div>
                    <div className="">
                      {
                        booking?.service_bookingsToservice
                          ?.subcategory_serviceTosubcategory?.name
                      }{" "}
                    </div>
                    <div>({booking?.service_bookingsToservice?.name})</div>
                    <div>{booking?.description} </div>
                  </div>
                ),

                startDate: new Date(
                  dateValue?.getFullYear(),
                  dateValue?.getMonth(),
                  dateValue?.getDate(),
                  Number(starttime[0]),
                  Number(starttime[1])
                ),
                endDate: new Date(
                  dateValue?.getFullYear(),
                  dateValue?.getMonth(),
                  dateValue?.getDate(),
                  Number(endtime[0]),
                  Number(endtime[1])
                ),
                priorityId: booking?.teammember?.id,
                location: booking?.branch_bookingsTobranch?.address,
                gender: booking?.customer_bookingsTocustomer?.gender,
                doctorName: booking?.teammember?.firstname,
                id: booking?.id,
                branchId: booking?.branch,
              });

              priorities.push({
                id: booking?.teammember?.id,
                text: booking?.teammember?.firstname,

                color: "#f99999",
                branch_Id: booking?.branch_bookingsTobranch?.id,
                branchId: booking?.branch,
              });

              providerCreationData?.push({
                id: booking?.teammember?.id,
                teamMemberImg: booking?.teammember?.profileimage,
                text:
                  booking?.teammember?.firstname == undefined
                    ? ""
                    : `${booking?.teammember?.firstname} + ${booking?.branch_bookingsTobranch?.id}`,
                color:
                  booking?.status == 5
                    ? "#f1efef"
                    : booking?.status == 2
                    ? "#ffa6a6"
                    : booking?.service_bookingsToservice
                        ?.category_categoryToservice?.color,
                branchId: booking?.branch,
              });
            }
          });

          if (data?.length > 0) {
            const filterProviderData = providerCreationData
              .filter(
                (obj, index, arr) =>
                  arr.findIndex((o) => o.id === obj?.id) === index
              )
              ?.map((obj) => ({ id: obj.id, ...obj }));

            const filterProviders = filterProviderData?.filter((item) => {
              if (!filterProvider[item.id]) {
                filterProvider[item.id] = true;
                return true;
              }
              return false;
            });
console.log(data, data.filter(
  (item) =>
    item.branchId === this.state.branchValueFromUrl? this.state.branchValueFromUrl: this.state.branchValue ||
    !this.state.branchValue
),'data')
            this.setState({
              // startingHour: new Date(startingHour).getHours(),
              // endingHour: new Date(endingHour).getHours(),
              data: data.filter(
                (item) =>
                  item.branchId === this.state.branchValueFromUrl? this.state.branchValueFromUrl: this.state.branchValue ||
                  !this.state.branchValue
              ),
            });
          } else {
            this.setState({
              // startingHour: new Date(startingHour).getHours(),
              // endingHour: new Date(endingHour).getHours(),
              data: data.filter(
                (item) =>
                  item.branchId === this.state.branchValue ||
                  !this.state.branchValue
              ),
              // resources: [
              //   {
              //     fieldName: 'priorityId',
              //     title: 'Priority',
              //     instances: priorities.filter(
              //       (item) =>
              //         item.branchId === this.state.branchValue ||
              //         !this.state.branchValue,
              //     ),
              //   },
              // ],
            });
          }
        } else {
          swal({
            title: "Get Calendar Data",
            text: resp?.data[Object.keys(resp.data)[0]],
            icon: "warning",
            button: "ok",
          });
        }
      });
  }

  // end of axios

  handleDoubleClick = (e) => {

    // Add your custom logic here
  };

  render() {
    const {
      data,
      currentDate,
      currentViewName,
      currentPriority,
      resources,
      loader,
      BranchidForBtn,
      branchList,
      isHoliday,
      holidays,
      startingHour,
      endingHour,
      branchValue,
    } = this.state;

    const setColors = () => {
      this.appointmentStatusEl = document.querySelectorAll(
        ".Appointment-appointment"
      );
      this.appointmentStatusEl.forEach((node) => {
        const getnodeData = node.querySelector(".appointmentStatus");
        if (getnodeData) {
          const statusCode = getnodeData.getAttribute("data-status");
          const categoryColor = getnodeData.getAttribute("id");
           let color;
          switch (statusCode) {
            case "2":
              color = "#f67a6f";
              break;
            case "4":
              color = "red";
              break;
            case "5":
              color = "#b1b1b1";
              break;
            default:
              color = categoryColor;
          }
          node.style.backgroundColor = color;
        }
      });
    };
    setColors();
    setTimeout(() => {
      setColors();
    }, 1000);
    setTimeout(() => {
      setColors();
    }, 2000);
    const teamList = localStorage.getItem("teams") !==undefined ? JSON.parse(localStorage.getItem("teams")) : [];
    return (
      <main
        className="main-content px-[var(--margin-x)] pb-2"
        style={{ padding: "0px", paddingTop: "11px", paddingBottom: "4rem" }}
      >
        <div
          style={{
            backgroundColor: "rgb(242 242 247 / 31%)",
            marginTop: "-11px",
          }}
          className="flex items-center px-4 space-x-4 py-5 lg:py-6"
        >
          <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Calendar
          </h2>
          <div className="hidden h-full py-1 sm:flex">
            <div className="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
          </div>
          <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
            <li className="flex items-center space-x-2">
              <a
                className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                href="/"
              >
                Dashboard
              </a>
              <svg
                xIgnore
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>Calendar</li>
          </ul>

          <div
            style={{
              display: "flex",
              marginLeft: "1%",
              flex: 9,
              justifyContent: "end",
            }}
          >
            <FormControl variant="standard" sx={{ m: 1, minWidth: 160 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {
                  branchList?.filter((branch) => {
                    const branchIdFromUrl = this.state.branchValueFromUrl
                      ? Number(this.state.branchValueFromUrl)
                      : Number(this.state.branchValue);
                    return branch?.id === branchIdFromUrl;
                  })[0]?.name
                }
                 
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                onChange={(e) => {
                  this.changeBranch(e.target.value);
                }}
                label="Filter by Branch"
              >
                {branchList?.map((branch, key) => (
                  <MenuItem value={branch?.id} id={key}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        {console.log(branchList, 'branchList')}
        {branchList && branchList?.length !== 0 ? (
          <>
         
            {teamList && teamList?.length !== 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6 text-center position-relative">
              {console.log(data, currentPriority, 'data, currentPriority')}
               <Paper>
                  <Scheduler
                    data={filterTasks(data, currentPriority)}
                    height={660} >
                    <ViewState
                      currentDate={currentDate}
                      currentViewName={currentViewName}
                      onCurrentViewNameChange={this.currentViewNameChange}
                      onCurrentDateChange={this.currentDateChange}  />
                      <GroupingState grouping={grouping} />
                      <DayView
                        startDayHour={startingHour}
                        endDayHour={endingHour}
                        timeTableCellComponent={DayViewTimeTableCell}
                        dayScaleCellComponent={DayViewDayScaleCell}
                        intervalCount={1}
                        excludedDays={holidays}
                      />

                      <DayView
                        startDayHour={startingHour}
                        endDayHour={endingHour}
                        name="3 Days"
                        timeTableCellComponent={ThreeDayViewTimeTableCell}
                        dayScaleCellComponent={DayViewDayScaleCell}
                        intervalCount={3}
                        excludedDays={holidays} 
                      />
                      <WeekView
                        startDayHour={startingHour}
                        endDayHour={endingHour}
                        name="Week"
                        timeTableCellComponent={WeekViewTimeTableCell}
                        dayScaleCellComponent={WeekViewDayScaleCell}
                        excludedDays={holidays}
                      />
                    {/* <AllDayPanel cellComponent={AllDayCell} /> */}

                    <Appointments onClick={this.handleSchedulerClick} />
                    <Resources data={resources} />
                    <IntegratedGrouping />

                    <GroupingPanel cellComponent={GroupingPanelCell} />
                    <Toolbar flexibleSpaceComponent={this.flexibleSpace} />
                    <TodayButton />
                    <DateNavigator />
                    <ViewSwitcher />
                    <AppointmentTooltip contentComponent={TooltipContent} />
                  </Scheduler>
                </Paper>
                { isHoliday==true &&
                  <div class="m-2 text-center mt-12 pt-4">
                    <img style={{display:"block", margin:"auto"}} class="mr-auto d-block w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]" src="/images/icons/Calendar.svg" alt="Calendar"/>
                    <h2 class="text-2xl font-semibold">You can't book</h2>
                    <div class="m-2">
                      <p>Appointment Not allowed for this date.</p> 
                    </div>
                </div>
                }
                {loader !== false && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 9999,
                      bottom: 0,
                      right: 0,
                      width: "100%",
                      left: "87px",
                      top: "71px",
                      height: "100%",
                      backgroundColor: "#f2f2f7",
                    }}
                  >
                    <img
                      style={{
                        position: "absolute",
                        zIndex: "9999",
                        top: " 50%",
                        bottom: 0,
                        left: " 50%",
                        right: 0,
                      }}
                      className="h-11 loader-img w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                      src="/images/icons/loader.svg"
                      alt="Loader"
                    />
                  </div>
                )}
                  </div>
                ) : loader == true ? (
                  <img
                    style={{
                      position: "absolute",
                      zIndex: "9999",
                      top: " 50%",
                      bottom: 0,
                      left: " 50%",
                      right: 0,
                    }}
                    className="h-11 loader-img w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                    src="/images/icons/loader.svg"
                    alt="Loader"
                  />
                ) : (
                  <div class="m-2 text-center mt-4 pt-4">
                    <i class="fas fa-calendar fa-6x"></i>
                    <h2 class="text-2xl font-semibold">Provider List Empty</h2>
                    <div class="m-2">
                      <p>Please first add Provider</p>
                      <img
                        style={{
                          position: "absolute",
                          zIndex: "9999",
                          top: " 50%",
                          bottom: 0,
                          left: " 50%",
                          right: 0,
                        }}
                        className="h-11 loader-img w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                        src="/images/icons/loader.svg"
                        alt="Loader"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div class="m-2 text-center mt-4 pt-4">
                <i class="fas fa-calendar fa-6x"></i>
                <h2 class="text-2xl font-semibold">Branch Not Found</h2>
                <div class="m-2">
                  <p>Please Add branch</p>
                  <img
                    style={{
                      position: "absolute",
                      zIndex: "9999",
                      top: " 50%",
                      bottom: 0,
                      left: " 50%",
                      right: 0,
                    }}
                    className="h-11 loader-img w-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                    src="/images/icons/loader.svg"
                    alt="Loader"
                  />
                </div>
              </div>
            )}
            <ToastContainer />
      </main>
    );
  }
}
