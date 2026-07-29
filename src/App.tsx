import { Layout } from './components/Layout';
import { OrderDetailPage } from './features/orders/OrderDetailPage';
import { OrdersPage } from './features/orders/OrdersPage';
import { useRoute } from './routing';

export function App() {
  const route = useRoute();
  return (
    <Layout route={route}>
      {route.name === 'orders' && <OrdersPage />}
      {route.name === 'order' && <OrderDetailPage orderId={route.orderId} />}
      {(route.name === 'not-found' || route.name === 'dispatch') && (
        <section>
          <h1>Page not found</h1>
        </section>
      )}
    </Layout>
  );
}
