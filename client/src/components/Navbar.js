import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

const Navbar = () => {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <AppBar position="static">
        <Container>
          <Toolbar>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <PeopleIcon sx={{ mr: 2 }} />
            </motion.div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Employee Management
            </Typography>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                color="inherit"
                component={RouterLink}
                to="/"
              >
                Employees
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                color="inherit"
                component={RouterLink}
                to="/add"
              >
                Add Employee
              </Button>
            </motion.div>
          </Toolbar>
        </Container>
      </AppBar>
    </motion.div>
  );
};

export default Navbar; 