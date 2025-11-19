import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Dialog,
  Chip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
type CustomField = {
  label: string;
  type: string;
  mandatory: boolean;
  options?: string[];
};

const Financials = () => {
  const [selectedContext, setSelectedContext] = useState("");
  const [openAddContext, setOpenAddContext] = useState(false);
  const [newContextName, setNewContextName] = useState("");

  const [optionInput, setOptionInput] = useState("");
  // const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);

  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const [contextList, setContextList] = useState([
    "Danube Project Milestone Details",
    "Construction Updates",
    "Financial Overview",
  ]);

  /* ADD FIELD STATES */
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldLabel, setFieldLabel] = useState("");
  const [controlType, setControlType] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [selectOptions, setSelectOptions] = useState([""]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [customFields, setCustomFields] = useState<
    Record<string, CustomField[]>
  >({});
  const [savedTemplates, setSavedTemplates] = useState<
    Record<string, CustomField[]>
  >({});

  /* CREATE CONTEXT */
  const handleCreateContext = () => {
    if (!newContextName.trim()) return;

    setContextList((prev) => [...prev, newContextName]);
    setSelectedContext(newContextName);
    setCustomFields((prev) => ({ ...prev, [newContextName]: [] }));
    setNewContextName("");
    setOpenAddContext(false);
  };

  /* ADD FIELD */
  const handleAddField = () => {
    if (!fieldLabel.trim() || !controlType.trim()) return;

    const newField: CustomField = {
      label: fieldLabel,
      type: controlType,
      mandatory: isMandatory,
    };

    if (controlType === "select") {
      newField.options = selectOptions.filter((o) => o.trim() !== "");
    }

    setCustomFields((prev) => {
      const updated = [...(prev[selectedContext] || [])];

      if (editingIndex !== null) {
        updated[editingIndex] = newField; // update
      } else {
        updated.push(newField); // add
      }

      return { ...prev, [selectedContext]: updated };
    });

    setFieldLabel("");
    setControlType("");
    setIsMandatory(false);
    setSelectOptions([""]);
    setEditingIndex(null);
    setOpenAddField(false);
  };

  /* DELETE FIELD */
  const handleDeleteField = (index: any) => {
    setCustomFields((prev) => ({
      ...prev,
      [selectedContext]: prev[selectedContext].filter((_, i) => i !== index),
    }));
  };

  /* EDIT FIELD */
  const handleEditField = (field: any, index: any) => {
    setFieldLabel(field.label);
    setControlType(field.type);
    setIsMandatory(field.mandatory || false);
    setSelectOptions(field.options || [""]);
    setOpenAddField(true);
    setEditingIndex(index);
  };

  /* DRAG & DROP */
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    setCustomFields((prev: any) => ({
      ...prev,
      [selectedContext]: reorder(
        prev[selectedContext],
        result.source.index,
        result.destination.index
      ),
    }));
  };

  /* SAVE TEMPLATE */
  const handleSaveTemplate = () => {
    const fields = customFields[selectedContext] || [];
    if (fields.length === 0) return;

    setSavedTemplates((prev) => ({
      ...prev,
      [selectedContext]: fields,
    }));

    alert("Template Saved!");
  };

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 1,
        p: 4,
        maxHeight: "47vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* GROUP 1 — CONTEXT SELECTION */}
      <Box sx={{ border: "1px solid #ddd", p: 3, borderRadius: 2, mb: 3 }}>
        <Grid
          container
          spacing={20}
          alignItems="center"
          sx={{ flexWrap: "nowrap" }}
        >
          <Grid item>
            <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
              Context
            </Typography>
          </Grid>

          <Grid item xs>
            <FormControl fullWidth>
              <InputLabel>Configuration Context</InputLabel>
              <Select
                label="Configuration Context"
                value={selectedContext}
                onChange={(e) => setSelectedContext(e.target.value)}
              >
                {contextList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              sx={{ background: "#2196f3", color: "#fff", px: 3 }}
              onClick={() => setOpenAddContext(true)}
            >
              + Add New Context
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* GROUP 2 — BASIC FINANCIALS */}
      <Box sx={{ border: "1px solid #ddd", p: 3, borderRadius: 2, mb: 3 }}>
        <Typography sx={{ fontWeight: 600, mb: 2 }}>
          Basic Financials
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField label="Basic Price Min" fullWidth size="small" />
          </Grid>

          <Grid item xs={4}>
            <TextField label="Basic Price Max" fullWidth size="small" />
          </Grid>

          <Grid item xs={4}>
            <TextField label="Maintenance Charge" fullWidth size="small" />
          </Grid>
        </Grid>
      </Box>

      {/* GROUP 3 — CONTEXT DETAILS */}
      {selectedContext && (
        <Box sx={{ border: "1px solid #ddd", p: 3, borderRadius: 2, mb: 3 }}>
          {/* STATIC DANUBE SECTION */}
          {selectedContext === "Danube Project Milestone Details" && (
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 2 }}>
                Danube Project Milestone Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Anticipated Handover Date"
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    label="Escrow Bank Account"
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField label="Sellars Account" fullWidth size="small" />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* CUSTOM CONTEXT SECTION (Saved OR Editable) */}
          {selectedContext !== "Danube Project Milestone Details" && (
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 2 }}>
                {selectedContext}
              </Typography>

              {/* -------------- STATIC TEMPLATE IF SAVED -------------- */}
              {savedTemplates[selectedContext] ? (
                <Grid container spacing={2}>
                  {savedTemplates[selectedContext].map((field: any, i: any) => (
                    <Grid item xs={4} key={i}>
                      {field.type === "text" && (
                        <TextField fullWidth size="small" label={field.label} />
                      )}

                      {field.type === "number" && (
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label={field.label}
                        />
                      )}

                      {field.type === "date" && (
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          label={field.label}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}

                      {field.type === "file" && (
                        <input type="file" style={{ width: "100%" }} />
                      )}

                      {field.type === "checkbox" && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <input type="checkbox" />
                          <Typography sx={{ ml: 1 }}>{field.label}</Typography>
                        </Box>
                      )}

                      {field.type === "select" && (
                        <FormControl fullWidth size="small">
                          <InputLabel>{field.label}</InputLabel>
                          <Select defaultValue="">
                            {field.options?.map((o: any, idx: any) => (
                              <MenuItem key={idx} value={o}>
                                {o}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                /* ---------------- EDITABLE + DRAGGABLE SECTION ---------------- */
                <>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="fields" direction="vertical">
                      {(provided: any) => (
                        <Grid
                          container
                          spacing={2}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {customFields[selectedContext]?.map(
                            (field: any, i: any) => (
                              <Draggable
                                key={i}
                                draggableId={String(i)}
                                index={i}
                              >
                                {(providedDrag: any) => (
                                  <Grid
                                    item
                                    xs={4}
                                    ref={providedDrag.innerRef}
                                    {...providedDrag.draggableProps}
                                    {...providedDrag.dragHandleProps}
                                  >
                                    <Box
                                      sx={{
                                        borderRadius: 1,
                                        p: 2,
                                        background: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      {/* Drag Handle */}
                                      <Box
                                        {...providedDrag.dragHandleProps}
                                        sx={{
                                          width: "16px",
                                          display: "flex",
                                          flexDirection: "column",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          cursor: "grab",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "grid",
                                            gridTemplateColumns:
                                              "repeat(2, 4px)",
                                            gap: "3px",
                                          }}
                                        >
                                          {Array.from({ length: 6 }).map(
                                            (_, idx) => (
                                              <Box
                                                key={idx}
                                                sx={{
                                                  width: "4px",
                                                  height: "4px",
                                                  bgcolor: "#9e9e9e",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            )
                                          )}
                                        </Box>
                                      </Box>

                                      {/* FIELD INPUT */}
                                      <Box sx={{ flex: 1 }}>
                                        {field.type === "text" && (
                                          <TextField
                                            fullWidth
                                            size="small"
                                            label={field.label}
                                          />
                                        )}

                                        {field.type === "number" && (
                                          <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            label={field.label}
                                          />
                                        )}

                                        {field.type === "date" && (
                                          <TextField
                                            fullWidth
                                            size="small"
                                            type="date"
                                            label={field.label}
                                            InputLabelProps={{ shrink: true }}
                                          />
                                        )}

                                        {field.type === "file" && (
                                          <input
                                            type="file"
                                            style={{ width: "100%" }}
                                          />
                                        )}

                                        {field.type === "checkbox" && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <input type="checkbox" />
                                            <Typography sx={{ ml: 1 }}>
                                              {field.label}
                                            </Typography>
                                          </Box>
                                        )}

                                        {field.type === "select" && (
                                          <FormControl fullWidth size="small">
                                            <InputLabel>
                                              {field.label}
                                            </InputLabel>
                                            <Select defaultValue="">
                                              {field.options.map(
                                                (o: any, idx: any) => (
                                                  <MenuItem key={idx} value={o}>
                                                    {o}
                                                  </MenuItem>
                                                )
                                              )}
                                            </Select>
                                          </FormControl>
                                        )}
                                      </Box>

                                      {/* Edit/Delete */}
                                      <Box sx={{ display: "flex", gap: 1 }}>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleEditField(field, i)
                                          }
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleDeleteField(i)}
                                        >
                                          <DeleteIcon
                                            fontSize="small"
                                            color="error"
                                          />
                                        </IconButton>
                                      </Box>
                                    </Box>
                                  </Grid>
                                )}
                              </Draggable>
                            )
                          )}

                          {provided.placeholder}
                        </Grid>
                      )}
                    </Droppable>
                  </DragDropContext>
                </>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                {!savedTemplates[selectedContext] && (
                  <Button
                    variant="outlined"
                    onClick={() => setOpenAddField(true)}
                  >
                    + Add Field
                  </Button>
                )}

                {!savedTemplates[selectedContext] && (
                  <Button variant="outlined" onClick={handleSaveTemplate}>
                    Save Template
                  </Button>
                )}

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setContextList((prev) =>
                      prev.filter((ctx) => ctx !== selectedContext)
                    );
                    setSelectedContext("");
                  }}
                >
                  Delete Context
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* ADD CONTEXT DIALOG */}
      <Dialog open={openAddContext} onClose={() => setOpenAddContext(false)}>
        <Box sx={{ p: 3, width: 400 }}>
          <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 2 }}>
            Add New Context
          </Typography>

          <TextField
            label="Context Name"
            fullWidth
            value={newContextName}
            onChange={(e) => setNewContextName(e.target.value)}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={() => setOpenAddContext(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateContext}>
              Create Context
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* ADD FIELD DIALOG */}
      <Dialog open={openAddField} onClose={() => setOpenAddField(false)}>
        <Box sx={{ p: 3, width: 450 }}>
          <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 2 }}>
            Add Field
          </Typography>

          <TextField
            label="Field Label *"
            fullWidth
            size="small"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Control Type *</InputLabel>
            <Select
              label="Control Type *"
              value={controlType}
              onChange={(e) => setControlType(e.target.value)}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="select">Dropdown</MenuItem>
              <MenuItem value="file">File Upload</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <input
              type="checkbox"
              checked={isMandatory}
              onChange={(e) => setIsMandatory(e.target.checked)}
            />
            <Typography sx={{ ml: 1 }}>Mark as mandatory</Typography>
          </Box>

          {/* Select Options */}
          {controlType === "select" && (
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontSize: "14px", mb: 1 }}>
                Dropdown Options
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Add Option"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && optionInput.trim() !== "") {
                      setSelectOptions((prev) => [...prev, optionInput.trim()]);
                      setOptionInput("");
                    }
                  }}
                />

                <Button
                  variant="contained"
                  onClick={() => {
                    if (!optionInput.trim()) return;
                    setSelectOptions((prev) => [...prev, optionInput.trim()]);
                    setOptionInput("");
                  }}
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                {selectOptions.map((opt, index) => (
                  <Chip
                    key={index}
                    label={opt}
                    onDelete={() =>
                      setSelectOptions((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    sx={{ background: "#E3F2FD" }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button onClick={() => setOpenAddField(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddField}>
              Add Field
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Financials;
