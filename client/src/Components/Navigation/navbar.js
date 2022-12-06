import React, {
  //useRef,
  useState,
  useEffect,
  //useReducer,
  //useContext,
} from "react";
import navbarLogo from "../../images/logo_dark.png";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
//import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
//import MoreIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";
/*In the navbar.js component, we will create a navigation bar
 that will link us to the required components using the following code. */
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import { USE_LOCAL_BACKEND } from "../../config.js";


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.2),
  },
  marginRight: theme.spacing(45),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(5),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '90vh',
    },
  },
}));



// Here, we display our Navbar
export default function Navbar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  let currentUserId = localStorage.getItem('user');
  const isMenuOpen = Boolean(anchorEl);
  const [UsersList, setUsersList] = useState("");
  const [UsersList2, setUsersList2] = useState(["1", "2"]);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    _id: "",
    email: "",
    password: "",
    username: "",
    name: "",
    surname: "",
    mobile_number: "",
    birth_date: "",
  });

  useEffect(() => {
    setUserInfo(props.user);
  }, [props.user])

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    localStorage.removeItem('user');
    navigate("/Login")
  }

  const settingsHandler = () => {
    window.alert("WIP")
  }

  useEffect(() => {
    console.log(UsersList);
  }, [UsersList]);

  useEffect(() => {
    console.log(inputValue);
    if (inputValue.trim().length >= 2) {
      fetch(
        USE_LOCAL_BACKEND
          ? `/GencFootball/user/userwithquery/${inputValue}`
          : `https://genc-football-backend.herokuapp.com/GencFootball/user/userwithquery/${inputValue}`
      )
        .catch((error) => {
          console.log("Caught error", error);
        })
        .then(response => response.json())
        .then(data => {
          setUsersList(data);
          /*
            if(data){
            setUserList(data);
            }
            else{
              setUserList("Loading");
            }
            console.log("UsersList is:",UsersList);
            */
        });
    }
  }, [inputValue])

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => option.username,
  });

  const SearchTextChangeHandler = async (event) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    setInputValue(event.target.value);
    await sleep(100);
  }

  const profileHandler = (event) => {
    event.preventDefault();
    navigate("/Profile", {
      state: {
        user_id: currentUserId,
      },
    });
  };

  const updateHandler = (event) => {
    event.preventDefault();
    navigate("/UpdateProfile", {
      state: {
        userInfo: userInfo,
      },
    });
  };

  const feedHandler = () => {
    navigate("/Feed", {
      state: {
        user_id: userInfo._id,
      },
    });
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={isMenuOpen}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={profileHandler}>
        <Avatar /> Profile
      </MenuItem>
      <MenuItem onClick={updateHandler}>
        <Avatar /> Update Account
      </MenuItem>
      <Divider color="gray" />
      <MenuItem onClick={settingsHandler}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={logoutHandler}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );


  return (
    <Box sx={{
      flexGrow: 1
    }}>
      <AppBar position="static" color="default" >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <button style={{ "border": "0px", "backgroundColor": "inherit" }}
            onClick={feedHandler}
          >
            <img style={{
              "maxHeight": 40,
              "marginBottom": 4,
            }} alt="" src={navbarLogo}></img>
          </button>
          <Search>
            {/* <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
          */}
            <Autocomplete
              id="free-solo-2-demo"
              freeSolo
              disableClearable
              options={UsersList ? UsersList : [{ username: "", name: "" }]}
              getOptionLabel={(option) => `${option.username}${option.name}`}
              sx={{ width: 500 }}
              renderOption={(props, option, state) => {
                return (
                  <h4
                    key={`${option.username}`}
                  >{`${option.username}`}</h4>
                );
              }
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search"
                  onChange={SearchTextChangeHandler}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}