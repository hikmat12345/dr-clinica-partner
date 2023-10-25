import * as React from 'react'
import {
  ViewState,
  GroupingState,
  IntegratedGrouping,
} from '@devexpress/dx-react-scheduler'
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
  AppointmentForm,
  GroupingPanel,
  Resources,
} from '@devexpress/dx-react-scheduler-material-ui'
import { connectProps } from '@devexpress/dx-react-core'
import { styled, alpha } from '@mui/material/styles'
import PriorityHigh from '@mui/icons-material/PriorityHigh'
import LowPriority from '@mui/icons-material/LowPriority'
import Lens from '@mui/icons-material/Lens'
import Event from '@mui/icons-material/Event'
import AccessTime from '@mui/icons-material/AccessTime'
import Paper from '@mui/material/Paper'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import classNames from 'clsx'
import './style.css'
import { priorities } from './tasks'
import { data as tasks } from './grouping'

const grouping = [
  {
    resourceName: 'priorityId',
  },
]

const filterTasks = (items, priorityId) =>
  items.filter((task) => !priorityId || task.priorityId === priorityId)

const getIconById = (id) => {
  if (id === 1) {
    return LowPriority
  }
  if (id === 2) {
    return Event
  }
  return PriorityHigh
}

const PREFIX = 'Demo'
const classes = {
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  prioritySelector: `${PREFIX}-prioritySelector`,
  content: `${PREFIX}-content`,
  contentContainer: `${PREFIX}-contentContainer`,
  text: `${PREFIX}-text`,
  title: `${PREFIX}-title`,
  icon: `${PREFIX}-icon`,
  contentItemIcon: `${PREFIX}-contentItemIcon`,
  grayIcon: `${PREFIX}-grayIcon`,
  colorfulContent: `${PREFIX}-colorfulContent`,
  lens: `${PREFIX}-lens`,
  textCenter: `${PREFIX}-textCenter`,
  dateAndTitle: `${PREFIX}-dateAndTitle`,
  titleContainer: `${PREFIX}-titleContainer`,
  container: `${PREFIX}-container`,
  bullet: `${PREFIX}-bullet`,
  prioritySelectorItem: `${PREFIX}-prioritySelectorItem`,
  priorityText: `${PREFIX}-priorityText`,
  priorityShortText: `${PREFIX}-priorityShortText`,
  cellLowPriority: `${PREFIX}-cellLowPriority`,
  cellMediumPriority: `${PREFIX}-cellMediumPriority`,
  cellHighPriority: `${PREFIX}-cellHighPriority`,
  headerCellLowPriority: `${PREFIX}-headerCellLowPriority`,
  headerCellMediumPriority: `${PREFIX}-headerCellMediumPriority`,
  headerCellHighPriority: `${PREFIX}-headerCellHighPriority`,
}
const stylesByPriority = priorities.reduce(
  (acc, priority) => ({
    ...acc,
    [`cell${priority.text.replace(' ', '')}`]: {
      backgroundColor: alpha(priority.color[400], 0.1),
      '&:hover': {
        backgroundColor: alpha(priority.color[400], 0.15),
      },
      '&:focus': {
        backgroundColor: alpha(priority.color[400], 0.2),
      },
    },
    [`headerCell${priority.text.replace(' ', '')}`]: {
      backgroundColor: alpha(priority.color[400], 0.1),
      '&:hover': {
        backgroundColor: alpha(priority.color[400], 0.1),
      },
      '&:focus': {
        backgroundColor: alpha(priority.color[400], 0.1),
      },
    },
  }),
  {},
)
const groupingStyles = ({ theme }) => ({
  [`&.${classes.cellLowPriority}`]: stylesByPriority.cellLowPriority,
  [`&.${classes.cellMediumPriority}`]: stylesByPriority.cellMediumPriority,
  [`&.${classes.cellHighPriority}`]: stylesByPriority.cellHighPriority,
  [`&.${classes.headerCellLowPriority}`]: stylesByPriority.headerCellLowPriority,
  [`&.${classes.headerCellMediumPriority}`]: stylesByPriority.headerCellMediumPriority,
  [`&.${classes.headerCellHighPriority}`]: stylesByPriority.headerCellHighPriority,
  [`& .${classes.icon}`]: {
    paddingLeft: theme.spacing(1),
    verticalAlign: 'middle',
  },
})

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    margin: '0 auto 0 0',
  },
}))
const StyledViewState = styled(ViewState)({
  '.css-18bo7dq.Root-root:first-of-type ': {
    border: '1px solid black',
    padding: '4px 54px',
    borderRadius: '1px',
    backgroundColor: '#f9f9f9',
  },
})

const StyledFormControl = styled(FormControl)(({ theme: { spacing } }) => ({
  [`&.${classes.prioritySelector}`]: {
    minWidth: 140,
    marginLeft: spacing(2),
    '@media (max-width: 500px)': {
      minWidth: 0,
      fontSize: '0.75rem',
      marginLeft: spacing(0.5),
    },
  },
}))

const StyledPrioritySelectorItem = styled('div')(
  ({ theme: { palette, spacing }, color }) => ({
    [`& .${classes.bullet}`]: {
      backgroundColor: color ? color[400] : palette.divider,
      borderRadius: '50%',
      width: spacing(2),
      height: spacing(2),
      marginRight: spacing(2),
      display: 'inline-block',
    },
    [`&.${classes.prioritySelectorItem}`]: {
      display: 'flex',
      alignItems: 'center',
    },
    [`& .${classes.priorityText}`]: {
      '@media (max-width: 500px)': {
        display: 'none',
      },
    },
    [`& .${classes.priorityShortText}`]: {
      '@media (min-width: 500px)': {
        display: 'none',
      },
    },
  }),
)
const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(
  groupingStyles,
)

const StyledTooltipContent = styled('div')(
  ({ theme: { spacing, typography, palette }, color }) => ({
    [`&.${classes.content}`]: {
      padding: spacing(3, 1),
      paddingTop: 0,
      backgroundColor: palette.background.paper,
      boxSizing: 'border-box',
      width: '400px',
    },
    [`& .${classes.contentContainer}`]: {
      paddingBottom: spacing(1.5),
    },
    [`& .${classes.text}`]: {
      ...typography.body2,
      display: 'inline-block',
    },
    [`& .${classes.title}`]: {
      ...typography.h6,
      color: palette.text.secondary,
      fontWeight: typography.fontWeightBold,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
    },
    [`& .${classes.icon}`]: {
      verticalAlign: 'middle',
    },
    [`& .${classes.contentItemIcon}`]: {
      textAlign: 'center',
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
      verticalAlign: 'super',
    },
    [`& .${classes.textCenter}`]: {
      textAlign: 'center',
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
  }),
)

const StyledDayViewDayScaleCell = styled(DayView.DayScaleCell)(groupingStyles)

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(groupingStyles)

const StyledAllDayPanelCell = styled(AllDayPanel.Cell)(groupingStyles)

const StyledGroupingPanelCell = styled(GroupingPanel.Cell)(groupingStyles)

const StyledDayViewTimeTableCell = styled(DayView.TimeTableCell)(groupingStyles)

const DayViewTimeTableCell = ({ groupingInfo, ...restProps }) => {
  const groupId = groupingInfo[0].id
  return (
    <StyledDayViewTimeTableCell
      className={classNames({
        [classes.cellLowPriority]: groupId === 1,
        [classes.cellMediumPriority]: groupId === 2,
        [classes.cellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  )
}
const DayViewDayScaleCell = ({ groupingInfo, ...restProps }) => {
  const groupId = groupingInfo[0].id
  return (
    <StyledDayViewDayScaleCell
      className={classNames({
        [classes.headerCellLowPriority]: groupId === 1,
        [classes.headerCellMediumPriority]: groupId === 2,
        [classes.headerCellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  )
}
const WeekViewTimeTableCell = ({ groupingInfo, ...restProps }) => {
  const groupId = groupingInfo[0].id
  return (
    <StyledWeekViewTimeTableCell
      className={classNames({
        [classes.cellLowPriority]: groupId === 1,
        [classes.cellMediumPriority]: groupId === 2,
        [classes.cellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  )
}
const WeekViewDayScaleCell = ({ groupingInfo, ...restProps }) => {
  const groupId = groupingInfo[0].id
  return (
    <StyledWeekViewDayScaleCell
      className={classNames({
        [classes.headerCellLowPriority]: groupId === 1,
        [classes.headerCellMediumPriority]: groupId === 2,
        [classes.headerCellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  )
}
const AllDayCell = ({ groupingInfo, ...restProps }) => {
  const groupId = groupingInfo[0].id
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
  )
}
const GroupingPanelCell = ({ group, ...restProps }) => {
  const groupId = group.id
  const Icon = getIconById(groupId)
  return (
    <StyledGroupingPanelCell
      className={classNames({
        [classes.headerCellLowPriority]: groupId === 1,
        [classes.headerCellMediumPriority]: groupId === 2,
        [classes.headerCellHighPriority]: groupId === 3,
      })}
      group={group}
      {...restProps}
    >
      <div class="flex flex-wrap justify-center ">
        <div class="w-28 sm:w-4/12 px-4">
          <img
            // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr1bUmKKii0o6miVz1u54dco7zuViHzACGzcvh0s66sA&s
            src="https://cdn-partners.fresha.com/assets/cbdf86c52d5cb265d459.png"
            alt="..."
            class="shadow rounded-full max-w-full h-auto align-middle border-solid border-4 border-indigo-600"
          />
        </div>
      </div>
      {/* <Icon className={classes.icon} /> */}
    </StyledGroupingPanelCell>
  )
}

const PrioritySelectorItem = ({ color, text: resourceTitle }) => {
  const text = resourceTitle || 'All'
  const shortText = resourceTitle ? text.substring(0, 1) : 'All'

  return (
    <StyledPrioritySelectorItem
      className={classes.prioritySelectorItem}
      color={color}
    >
      {/* <span className={classes.bullet} /> */}
      <span className={classes.priorityText}>{text}</span>
      <span className={classes.priorityShortText}>{shortText}</span>
    </StyledPrioritySelectorItem>
  )
}

const PrioritySelector = ({ priorityChange, priority }) => {
  const currentPriority = priority > 0 ? priorities[priority - 1] : {}
  return (
    <StyledFormControl className={classes.prioritySelector} variant="standard">
      <Select
        disableUnderline
        value={priority}
        onChange={(e) => {
          priorityChange(e.target.value)
        }}
        renderValue={() => (
          <PrioritySelectorItem
            text={currentPriority.text}
            color={currentPriority.color}
          />
        )}
      >
        <MenuItem value={0}>
          <PrioritySelectorItem />
        </MenuItem>
        {priorities.map(({ id, color, text }) => (
          <MenuItem value={id} key={id.toString()}>
            <PrioritySelectorItem color={color} text={text} />
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  )
}

const FlexibleSpace = ({ priority, priorityChange, ...restProps }) => (
  <StyledToolbarFlexibleSpace {...restProps} className={classes.flexibleSpace}>
    <PrioritySelector priority={priority} priorityChange={priorityChange} />
  </StyledToolbarFlexibleSpace>
)
const TooltipContent = ({
  appointmentData,
  formatDate,
  appointmentResources,
}) => {
  const resource = appointmentResources[0]
  let icon = <LowPriority className={classes.icon} />
  if (appointmentData.priorityId === 2) {
    icon = <Event className={classes.icon} />
  }
  if (appointmentData.priorityId === 3) {
    icon = <PriorityHigh className={classes.icon} />
  }
  return (
    <StyledTooltipContent className={classes.content} color={resource.color}>
      <Grid
        container
        alignItems="flex-start"
        className={classes.titleContainer}
      >
        <Grid item xs={2} className={classNames(classes.textCenter)}>
          <Lens className={classNames(classes.lens, classes.colorfulContent)} />
        </Grid>
        <Grid item xs={10}>
          <div>
            <div className={classNames(classes.title, classes.dateAndTitle)}>
              {appointmentData.title}
            </div>
            <div className={classNames(classes.text, classes.dateAndTitle)}>
              {formatDate(appointmentData.startDate, {
                day: 'numeric',
                weekday: 'long',
              })}
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container alignItems="center" className={classes.contentContainer}>
        <Grid item xs={2} className={classes.textCenter}>
          <AccessTime className={classes.icon} />
        </Grid>
        <Grid item xs={10}>
          <div className={classes.text}>
            {`${formatDate(appointmentData.startDate, {
              hour: 'numeric',
              minute: 'numeric',
            })}
              - ${formatDate(appointmentData.endDate, {
                hour: 'numeric',
                minute: 'numeric',
              })}`}
          </div>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        key={`${resource.fieldName}_${resource.id}`}
      >
        <Grid
          className={classNames(
            classes.contentItemIcon,
            classes.icon,
            classes.colorfulContent,
          )}
          item
          xs={2}
        >
          {icon}
        </Grid>
        <Grid item xs={10}>
          <span className={classNames(classes.text, classes.colorfulContent)}>
            {resource.text}
          </span>
        </Grid>
      </Grid>
    </StyledTooltipContent>
  )
}

export default class CalendarThree extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      currentDate: '2018-05-28',
      currentViewName: 'Day',
      data: tasks,
      currentPriority: 0,
      resources: [
        {
          fieldName: 'priorityId',
          title: 'Priority',
          instances: priorities,
        },
      ],
    }
    this.currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName })
    }
    this.currentDateChange = (currentDate) => {
      this.setState({ currentDate })
    }
    this.priorityChange = (value) => {
      const { resources } = this.state
      const nextResources = [
        {
          ...resources[0],
          instances: value > 0 ? [priorities[value - 1]] : priorities,
        },
      ]

      this.setState({ currentPriority: value, resources: nextResources })
    }
    this.flexibleSpace = connectProps(FlexibleSpace, () => {
      const { currentPriority } = this.state
      return {
        priority: currentPriority,
        priorityChange: this.priorityChange,
      }
    })
  }
  AddAppointmentHandler = () => {
    window.location.href = '/calendar/addappointment'
  }
  componentDidUpdate() {
    this.flexibleSpace.update()
  }

  handleNavigate = (id) => {
    // Navigate to the target screen using the appointment ID
    console.log(`Navigating to screen for appointment ${id}`)
  }
  render() {
    const {
      data,
      currentDate,
      currentViewName,
      currentPriority,
      resources,
    } = this.state
    const calendarStyle = {
      backgroundColor: 'red', // change this to the desired color
      color: 'white', // change this to the desired text color
    }
    return (
      <main
        className="main-content px-[var(--margin-x)] pb-2"
        style={{ padding: '11px' }}
      >
        <div className="flex items-center space-x-4 py-5 lg:py-6">
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
                x-ignore
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
              display: 'flex',
              marginLeft: '1%',
              flex: 9,
              justifyContent: 'end',
            }}
          >
            <button
              style={{ backgroundColor: 'black', color: 'white' }}
              className="btn space-x-2 bg-slate-150 bg-black font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
              onClick={this.AddAppointmentHandler}
            >
              Add Appointment
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-1 lg:gap-6 text-center">
          <Paper>
            <Scheduler
              style={calendarStyle}
              data={filterTasks(data, currentPriority)}
              height={660}
            >
              <StyledViewState
                currentDate={currentDate}
                currentViewName={currentViewName}
                onCurrentViewNameChange={this.currentViewNameChange}
                onCurrentDateChange={this.currentDateChange}
              />
              <GroupingState grouping={grouping} />

              <DayView
                startDayHour={9}
                endDayHour={19}
                timeTableCellComponent={DayViewTimeTableCell}
                dayScaleCellComponent={DayViewDayScaleCell}
                intervalCount={1}
              />
              <DayView
                startDayHour={8}
                endDayHour={16}
                name="3 Days"
                intervalCount={3}
              />
              <WeekView
                startDayHour={9}
                endDayHour={17}
                name="Week"
                timeTableCellComponent={WeekViewTimeTableCell}
                dayScaleCellComponent={WeekViewDayScaleCell}
              />
              <AllDayPanel cellComponent={AllDayCell} />

              <Appointments />
              <Resources data={resources} />
              <IntegratedGrouping />

              <GroupingPanel cellComponent={GroupingPanelCell} />
              <Toolbar flexibleSpaceComponent={this.flexibleSpace} />
              <DateNavigator />
              <ViewSwitcher />
              <AppointmentTooltip
                contentComponent={TooltipContent}
                showOpenButton
                showCloseButton
              />

              <AppointmentForm />
            </Scheduler>
          </Paper>
        </div>
      </main>
    )
  }
}
