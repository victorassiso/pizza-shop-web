import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { getOrderDetails } from '@/api/orders/get-order-details'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { OrderDetailsSkeleton } from './order-details-skeleton'

interface OrderDetailsProps {
  id: string
  open: boolean
}

export function OrderDetails({ id, open }: OrderDetailsProps) {
  const { data: order, isLoading: isOrderDetailsLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderDetails({ id }),
    enabled: open,
  })

  const total = order?.orderItems.reduce(
    (acc, curr) => curr.price * curr.quantity + acc,
    0,
  )

  return (
    <>
      {isOrderDetailsLoading && <OrderDetailsSkeleton />}
      {order && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pedido: {order?.id}</DialogTitle>
            <DialogDescription>Detalhes do pedido</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Status
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      <span className="font-medium text-muted-foreground">
                        {order?.status}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Cliente
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {order?.customer.name}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Telefone
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {order?.customer.phone ?? 'Não informado'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    E-mail
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {order?.customer.email}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Realizado há
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {order &&
                      formatDistanceToNow(order.createdAt, {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {order?.orderItems.map((item) => {
                  const price = item.price
                  const subtotal = price * item.quantity

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {subtotal.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total do pedido</TableCell>
                  <TableCell className="text-right font-medium">
                    {total?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </DialogContent>
      )}
    </>
  )
}
