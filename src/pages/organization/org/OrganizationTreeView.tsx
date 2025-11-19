import React, { useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import StoreIcon from "@mui/icons-material/Store";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

/* --- Types --- */
interface Project {
  id: string | number;
  projectName: string;
}

interface Branch {
  id: string | number;
  branchName: string;
  projects?: Project[];
}

interface Organization {
  id: string | number;
  companyName: string;
  branches?: Branch[];
}

/* --- Static data shared across all orgs --- */
const STATIC_PROJECTS: Project[] = [
  { id: "sp-1", projectName: "BlueHaven Apartments" },
  { id: "sp-2", projectName: "SilverLeaf Villas" },
];

const STATIC_BRANCHES: Branch[] = [
  {
    id: "sb-1",
    branchName: "Lakeshore Branch",
    projects: [...STATIC_PROJECTS],
  },
  {
    id: "sb-2",
    branchName: "West Park Branch",
    projects: [{ id: "sp-3", projectName: "The Summit Residences" }],
  },
];

/* --- OrganizationTreeView: merges organization data with static data --- */
interface OrganizationTreeViewProps {
  data: Organization[];
}

const OrganizationTreeView: React.FC<OrganizationTreeViewProps> = ({
  data,
}) => {
  // Helper to merge org-specific branches with static ones (ensures unique ids)
  const buildBranchesForOrg = (org: Organization): Branch[] => {
    // Clone org branches (if any), and ensure each branch has projects (use static projects fallback)
    const orgBranches = (org.branches || []).map((b) => ({
      ...b,
      id: `org-${org.id}-br-${b.id}`,
      projects:
        b.projects && b.projects.length
          ? b.projects.map((p) => ({ ...p, id: `org-${org.id}-pr-${p.id}` }))
          : undefined,
    }));

    // Clone static branches while namespacing their ids so keys are stable and unique per org
    const namespacedStatic = STATIC_BRANCHES.map((sb) => ({
      ...sb,
      id: `static-${org.id}-${sb.id}`,
      projects: sb.projects
        ? sb.projects.map((p) => ({ ...p, id: `static-${org.id}-${p.id}` }))
        : undefined,
    }));

    // Example merge strategy: show orgBranches first, then static ones
    return [...orgBranches, ...namespacedStatic];
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      {data?.map((org) => (
        <CollapsibleItem
          key={org.id}
          icon={<BusinessIcon sx={{ color: "blue" }} />}
          text={org.companyName}
          level={0}
          type="organization"
          childrenItems={buildBranchesForOrg(org)}
        />
      ))}
    </Paper>
  );
};

/* --- CollapsibleItem component (recursive) --- */
interface CollapsibleItemProps {
  icon: React.ReactNode;
  text: string;
  level: number;
  type: "organization" | "branch" | "project";
  childrenItems?: any[] | null;
}

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({
  icon,
  text,
  childrenItems,
  level,
  type,
}) => {
  const [open, setOpen] = useState(false);

  // compute next level type based on current type
  const getNextType = (): "branch" | "project" => {
    if (type === "organization") return "branch";
    return "project";
  };

  const getIconByType = (t: string) => {
    switch (t) {
      case "branch":
        return <StoreIcon sx={{ color: "green" }} />;
      case "project":
        return <HomeWorkIcon sx={{ color: "red" }} />;
      default:
        return <BusinessIcon sx={{ color: "blue" }} />;
    }
  };

  return (
    <div
      style={{
        marginLeft: level * 20,
        marginBottom: "10px",
        paddingTop: "10px",
        paddingBottom: "4px",
      }}
    >
      <Box
        onClick={() => childrenItems?.length && setOpen(!open)}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: childrenItems?.length ? "pointer" : "default",
        }}
      >
        {childrenItems?.length ? (
          open ? (
            <ExpandMoreIcon sx={{ mr: 1, fontSize: "20px" }} />
          ) : (
            <ChevronRightIcon sx={{ mr: 1, fontSize: "20px" }} />
          )
        ) : (
          <span style={{ width: "24px" }} />
        )}

        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {icon}
          <Typography fontSize="14px">{text}</Typography>
        </span>
      </Box>

      {open &&
        childrenItems?.map((item: any) => (
          <CollapsibleItem
            key={item.id}
            icon={getIconByType(getNextType())}
            text={item.branchName || item.projectName}
            level={level + 1}
            type={getNextType()}
            childrenItems={item.branches || item.projects || null}
          />
        ))}
    </div>
  );
};

export default OrganizationTreeView;
