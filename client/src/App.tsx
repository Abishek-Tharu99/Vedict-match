import { Route, Switch } from "wouter";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Report } from "./pages/Report";
import { Reports } from "./pages/Reports";
import { Card } from "./components/ui";
import { Blog } from "./pages/Blog";
import { BlogDetails } from "./pages/BlogDetails";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/Protectedroute";
import { CreateBlog } from "./pages/CreateBlog";

export function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/report" component={Report} />
        <Route path="/reports" component={Reports} />
        <Route path="/blog/:slug" component={BlogDetails} />
        <Route path="/admin/login" component={AdminLogin} />
        
        <Route path="/admin/dashboard">
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>

        <Route path="/admin/blog/new" component={CreateBlog}/>


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
