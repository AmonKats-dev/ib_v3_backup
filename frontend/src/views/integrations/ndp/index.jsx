import {
  Badge,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Button, useDataProvider, useNotify, useRefresh } from "react-admin";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import lodash from "lodash";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "500px",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "25px",
  },
  rootTitle: {
    marginBottom: "20px",
  },
  content: {
    display: "flex",
    gap: "55px",
    width: "100%",
    padding: "25px",
  },
  list: {
    height: "70vh",
    overflow: "auto",
    width: "100%",
    "& .MuiListItem-container": {
      "&:hover $listItemActions": {
        visibility: "visible",
      },
    },
  },
  listContent: {
    width: "100%",
  },
  title: {
    textAlign: "center",
  },
  actions: {
    padding: "20px",
    gap: "20px",
    justifyContent: "space-between",
  },
  iconDelete: {
    color: "#546e7a",
    cursor: "pointer",
  },
  listItem: {},
  listItemActions: {
    visibility: "hidden",
  },
  formControl: {
    justifySelf: "flex-start",
    width: "50%",
  },
}));

const IntegrationsNdp = () => {
  const [links, setLinks] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState();

  const [projects, setProjects] = useState([]);
  const [projectsNDP, setProjectsNDP] = useState([]);
  const [checkedLeft, setCheckedLeft] = useState([]);
  const [checkedRight, setCheckedRight] = useState([]);
  const [filterLeft, setFilterLeft] = useState("");
  const [filterRight, setFilterRight] = useState("");

  const dataProvider = useDataProvider();
  const classes = useStyles();
  const notify = useNotify();
  const refresh = useRefresh();

  const getProjectLists = () => {
    if (selectedProgram) {
      dataProvider
        .integrations("ndp", {
          additionalData: "projects",
          sort_field: "id",
          filter: { 
            // program_code: selectedProgram.code, 
            is_not_linked: true 
          },
        })
        .then((res) => {
          if (res && res.data) {
            setProjectsNDP(res.data);
          }
        });

      dataProvider
        .getListOfAll("projects", {
          filter: {
            is_deleted: false,
            is_not_in_ndp: true,
            program_id: Number(selectedProgram.id),
          },
        })
        .then((response) => {
          if (response && response.data) {
            setProjects(response.data);
          }
        });
    }
  };

  React.useEffect(() => {
    dataProvider
      .getListOfAll("programs", { filter: { level: 1 } })
      .then((res) => {
        if (res && res.data) {
          setResources(res.data);
        }
      });
  }, [dataProvider]);

  useEffect(() => {
    getProjectLists();
  }, [selectedProgram]);

  const handleToggleLeft = (projectId) => {
    setCheckedLeft([projectId]);
  };
  const handleToggleRight = (projectId) => {
    setCheckedRight([projectId]);
  };

  const createLink = () => {
    if (checkedLeft.length && checkedRight.length) {
      const link = {
        checkedLeft: checkedLeft[0],
        checkedRight: checkedRight[0],
      };

      setLinks((prev) => [...prev, link]);
      setCheckedLeft([]);
      setCheckedRight([]);
    }
  };

  const handleSubmit = () => {
    const resultLinks = links.map((link) => {
      const ibpProject = lodash.find(
        projects,
        (item) => item.id === link.checkedLeft
      );
      const ndpProject = lodash.find(
        projectsNDP,
        (item) => item.id === link.checkedRight
      );
      return {
        ndp_project_id: ndpProject.id,
        ndp_pip_code: ndpProject.ndp_pip_code,
        project_id: ibpProject.id,
      };
    });

    if (resultLinks.length) {
      dataProvider
        .integrationsCreateLink("ndp", {
          data: resultLinks,
        })
        .then((res) => {
          notify("Link created!", "success");
          setLinks([]);
          refresh();
          getProjectLists();
        });
    }
  };

  const handleDeleteLink = (link) => {
    setLinks((prev) =>
      prev.filter(({ checkedLeft, checkedRight }) => {
        return (
          checkedLeft !== link.checkedLeft && checkedRight !== link.checkedRight
        );
      })
    );
  };

  const leftSideProjects = () => {
    return projects
      .filter((project) => {
        if (links.length === 0) return true;
        return !lodash.find(links, (link) => link.checkedLeft === project.id);
      })
      .filter((item) =>
        filterLeft
          ? String(item.name).toLowerCase().indexOf(filterLeft.toLowerCase()) >
              -1 ||
            String(item.code).toLowerCase().indexOf(filterLeft.toLowerCase()) >
              -1
          : true
      );
  };

  const rightSideProjects = () => {
    return projectsNDP
      .filter((project) => {
        if (links.length === 0) return true;
        return !lodash.find(links, (link) => link.checkedRight === project.id);
      })
      .filter((item) =>
        filterRight
          ? String(item.project_name)
              .toLowerCase()
              .indexOf(filterRight.toLowerCase()) > -1 ||
            String(item.project_coa_code)
              .toLowerCase()
              .indexOf(filterRight.toLowerCase()) > -1
          : true
      );
  };

  const handleChange = (ev) => {
    if (links.length) {
      setLinks([]);
    }
    setSelectedProgram(ev.target.value);
  };

  return (
    <Card className={classes.root}>
      <h2 className={classes.rootTitle}>NDP Integration</h2>
      <CardActions className={classes.actions}>
        <div style={{ display: "flex", gap: "25px", alignContent: "center" }}>
          <h2>Select Program: </h2>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel style={{ textTransform: "capitalize" }}>
              Filter by Program
            </InputLabel>
            <Select
              fullWidth
              value={selectedProgram?.id}
              onChange={handleChange}
              MenuProps={MenuProps}
              label={"Filter by Program"}
              style={{ width: "350px" }}
            >
              {resources &&
                resources.map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {`${item.code} - ${item.name}`}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ display: "flex", gap: "25px" }}>
          {projects.length > 0 && (
            <Badge badgeContent={links.length} color="primary">
              <Button
                label="Add link"
                variant="outlined"
                startIcon={<PlaylistAddIcon />}
                onClick={createLink}
              />
            </Badge>
          )}
          {links.length > 0 && (
            <Button
              label="Submit"
              startIcon={<DoneAllIcon />}
              variant="contained"
              onClick={handleSubmit}
            />
          )}
        </div>
      </CardActions>
      {selectedProgram && projects.length > 0 && (
        <CardContent className={classes.content}>
          <div className={classes.listContent}>
            <h3 className={classes.title}>NDP</h3>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              onChange={(ev) => {
                setFilterRight(ev.target.value);
              }}
            />
            <List className={classes.list}>
              {projectsNDP && rightSideProjects().length > 0 ? (
                rightSideProjects().map((project) => {
                  const labelId = `checkbox-list-label-${project.id}`;
                  if (!project) return null;

                  return (
                    <ListItem
                      key={project.id}
                      dense
                      onClick={() => handleToggleRight(project.id)}
                      className={classes.listItem}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checkedRight.indexOf(project.id) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={
                          project &&
                          `${project.ndp_pip_code} - ${project.project_name}`
                        }
                      />
                    </ListItem>
                  );
                })
              ) : (
                <h3 className={classes.title}>No items to show</h3>
              )}
            </List>
          </div>
          <div className={classes.listContent}>
            <h3 className={classes.title}>IBP</h3>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              onChange={(ev) => {
                setFilterLeft(ev.target.value);
              }}
            />
            <List className={classes.list}>
              {projects && leftSideProjects().length > 0 ? (
                leftSideProjects().map((project) => {
                  const labelId = `checkbox-list-label-${project.id}`;
                  if (!project) return null;

                  return (
                    <ListItem
                      key={project.id}
                      dense
                      onClick={() => handleToggleLeft(project.id)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checkedLeft.indexOf(project.id) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={project && `${project.code} - ${project.name}`}
                      />
                    </ListItem>
                  );
                })
              ) : (
                <h3 className={classes.title}>No items to show</h3>
              )}
            </List>
          </div>

          <div
            className={classes.listContent}
            style={{ backgroundColor: "#f7f7f7" }}
          >
            <h3 className={classes.title}>Links</h3>
            <List className={classes.list}>
              {projects &&
                projects.length > 0 &&
                links.map((project) => {
                  const labelId = `checkbox-list-label-${project.id}`;
                  const projectLeft = lodash.find(
                    projects,
                    (item) => item.id === project.checkedLeft
                  );
                  const projectRight = lodash.find(
                    projectsNDP,
                    (item) => item.id === project.checkedRight
                  );
                  const listItem = `${projectRight.ndp_pip_code} - ${projectLeft.code}`;

                  return (
                    <ListItem
                      key={project.id}
                      dense
                      onClick={() => handleToggleRight(project.id)}
                      className={classes.listItem}
                    >
                      <ListItemText id={labelId} primary={`${listItem}`} />
                      <ListItemSecondaryAction
                        className={classes.listItemActions}
                      >
                        <DeleteOutlineOutlinedIcon
                          className={classes.iconDelete}
                          onClick={() => handleDeleteLink(project)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
            </List>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default IntegrationsNdp;
