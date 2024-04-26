import { base } from "./base";

export interface Order {
  id: string;
  subtotalLineItemsQuantity: number;
  originalTotalPriceSet: {
    shopMoney: {
      amount: number;
    };
  };
  currentSubtotalLineItemsQuantity: number;
  currentTotalPriceSet: {
    shopMoney: {
      amount: number;
    };
  };
  totalDiscountsSet: {
    shopMoney: {
      amount: number;
    };
  };
  lineItems: { edges: LineItem[] };
  returns: { edges: Return[] };
  createdAt: string;
}

interface LineItem {
  node: {
    id: string;
    sku: string;
    quantity: number;
    currentQuantity: number;
    originalUnitPriceSet: {
      shopMoney: {
        amount: number;
      };
    };
    totalDiscountSet: {
      shopMoney: {
        amount: number;
      };
    };
  };
}

interface Return {
  node: { refunds: { edges: Refund[] } };
}

interface Refund {
  node: {
    totalRefundedSet: {
      shopMoney: {
        amount: number;
      };
    };
  };
}

export const ordersQuery = async (query?: string): Promise<Order[]> => {
  const orders = await base(
    "orders",
    `id
    subtotalLineItemsQuantity
    originalTotalPriceSet {
      shopMoney {
        amount
      }
    }
    currentSubtotalLineItemsQuantity
    currentTotalPriceSet {
      shopMoney {
        amount
      }
    }
    totalDiscountsSet {
      shopMoney {
        amount
      }
    }
    lineItems(first: 50) {
      edges {
        node {
          id
          sku
          quantity
          currentQuantity
          originalUnitPriceSet {
            shopMoney {
              amount
            }
          }
          totalDiscountSet {
            shopMoney {
              amount
            }
          }
        }
      }
    }
    createdAt`,
    query
  );
  // returns(first: 5) {
  //   edges {
  //     node {
  //       refunds(first: 5) {
  //         edges {
  //           node {
  //             totalRefundedSet {
  //               shopMoney {
  //                 amount
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  return orders;
};
