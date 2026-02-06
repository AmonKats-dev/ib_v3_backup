// import CostPlansList from "./CostPlansList";
import WorkPlansShow from "./WorkPlansShow";
import WorkPlansCreate from "./WorkPlansCreate";
import { EditGuesser, ListGuesser } from "react-admin";
import WorkPlansEdit from "./WorkPlansEdit";

export default {
  list: ListGuesser,
  show: WorkPlansShow,
  create: WorkPlansCreate,
  edit: WorkPlansEdit,
};
