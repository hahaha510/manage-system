import BaseTable from "./BaseTable";
import QueryForm from "./QueryForm";
export default {
  install(app) {
    app.use(QueryForm);
    app.use(BaseTable);
  },
};
