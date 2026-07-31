import { getOrder } from '../../api/orders';
import { AppLink } from '../../components/AppLink';
import { ErrorMessage } from '../../components/ErrorMessage';
import { StatusBadge } from '../../components/StatusBadge';
import { useLoad } from '../../useLoad';

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const [order] = useLoad((signal) => getOrder(orderId, signal), orderId);

  if (order.state === 'loading') {
    return <p role="status">Loading the order…</p>;
  }
  if (order.state === 'failed' || !order.value) {
    return order.state === 'failed' ? <ErrorMessage error={order.error} /> : null;
  }
  const value = order.value;
  return (
    <article aria-labelledby="order-heading">
      <p>
        <AppLink to="/orders">Back to orders</AppLink>
      </p>
      <h1 id="order-heading">Order for {value.consignee.name}</h1>
      <dl className="facts">
        <dt>Status</dt>
        <dd>
          <StatusBadge status={value.status} />
        </dd>
        <dt>Customer account</dt>
        <dd>{value.customerAccountId}</dd>
        <dt>Service</dt>
        <dd>{value.serviceLevel}</dd>
        <dt>Deliver to</dt>
        <dd>
          {value.consignee.line1}
          {value.consignee.line2 ? `, ${value.consignee.line2}` : ''}, {value.consignee.postalCode}{' '}
          {value.consignee.city}, {value.consignee.countryCode}
        </dd>
        <dt>Parcels</dt>
        <dd>
          {value.parcels.length} parcels, {(value.totalWeightGrams / 1000).toFixed(1)} kg
        </dd>
        <dt>Placed by</dt>
        <dd>{value.placedBy}</dd>
      </dl>
    </article>
  );
}
