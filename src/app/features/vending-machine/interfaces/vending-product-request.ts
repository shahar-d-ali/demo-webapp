export interface VendingProductRequestDto {
  vendingMachineId?: number;
  productId?: number;
  slotNumber?: string;
  capacity?: number;
  quantity?: number;
  price?: number;
  active?: boolean;
}
