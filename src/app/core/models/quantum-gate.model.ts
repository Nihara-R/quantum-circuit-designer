export class QuantumGateModel {
  constructor(
    public id: string,
    public type: string,
    public qubitIndex: number,
    public position: number,
    public controlQubit?: number,
    public parameter?: number
  ) {}

  static create(type: string, qubitIndex: number, position: number): QuantumGateModel {
    return new QuantumGateModel(
      this.generateId(),
      type,
      qubitIndex,
      position
    );
  }

  static createControlled(
    type: string,
    controlQubit: number,
    targetQubit: number,
    position: number
  ): QuantumGateModel {
    return new QuantumGateModel(
      this.generateId(),
      type,
      targetQubit,
      position,
      controlQubit
    );
  }

  private static generateId(): string {
    return `gate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clone(): QuantumGateModel {
    return new QuantumGateModel(
      this.id,
      this.type,
      this.qubitIndex,
      this.position,
      this.controlQubit,
      this.parameter
    );
  }
}