import { Route, Switch } from "wouter";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Report } from "./pages/Report";
import { Reports } from "./pages/Reports";
import { Card } from "./components/ui";

export function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/report" component={Report} />
        <Route path="/reports" component={Reports} />
        <Route>
          <Card className="mx-auto max-w-md p-10 text-center">
            <h2 className="text-lg font-semibold text-[var(--ink)]">Page not found</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">That cosmic path doesn’t exist.</p>
          </Card>
        </Route>
      </Switch>
    </Layout>
  );
}
