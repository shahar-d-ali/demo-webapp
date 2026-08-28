export interface VendingProductResponseDto {
  id: number;
  vendingMachineId: number;
  productId: number;
  slotNumber: string;
  capacity: number;
  quantity: number;
  price: number;
  active: boolean;
}
