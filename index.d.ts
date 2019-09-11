interface Subscription {
  unsubscribe: () => void
}

export default function checkAll(container: Element): Subscription;
