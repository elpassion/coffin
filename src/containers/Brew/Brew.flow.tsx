import { getByText, queryByText, render, wait } from "@testing-library/react";
import { App } from "containers/App";
import React from "react";
import { ButtonElement } from "testElements/Button.element";
import { SelectInputElement } from "testElements/SelectInput.element";
import { TextInputElement } from "testElements/TextInput.element";
import { BrewingBasicsFormValues } from "./components/BrewBasicsForm";
import { BrewingCustomizationFormValues } from "./components/BrewCustomizationForm";
import { BrewingProcess, BrewingTechnique, GrindSize } from "./options";
import { Routing } from "utils/routing";
import { Api, ApiContext, CreateBrewData } from "api/api";

export class BrewFlow {
  static async render() {
    const api: Api = { createBrew: jest.fn(), getBrews: jest.fn().mockResolvedValue([]) };
    const { container } = render(
      <ApiContext.Provider value={api}>
        <App />
      </ApiContext.Provider>
    );
    return new BrewFlow(container, api);
  }

  private constructor(private readonly container: HTMLElement, private readonly api: Api) {}

  public async addNewBrew() {
    this.addNewBrewButton.click();
  }

  public async rateBrew() {
    this.rateBrewButton.click();
  }

  public async setCoffeeName(coffeeName: string) {
    return this.coffeeNameInput.setValue(coffeeName);
  }

  public async setBrewingMethod(brewingMethod: BrewingTechnique) {
    this.brewingMethodInput.setValue(brewingMethod);
  }

  public async setBrewingProcess(brewingProcess: BrewingProcess) {
    this.brewingProcessInput.setValue(brewingProcess);
  }

  public async openBrewCustomization() {
    this.openBrewCustomizationButton.click();
  }

  public async customizeBrew({ coffeeWeight, grindSize, waterDose }: BrewingCustomizationFormValues) {
    this.coffeeWeightInput.setValue(coffeeWeight);
    this.waterDoseInput.setValue(waterDose);
    this.grindSizeInput.setValue(grindSize);
  }

  public async setRating(rating: string) {
    this.ratingInput.setValue(rating);
  }

  public async saveBrew() {
    this.saveBrewButton.click();
    await wait();
  }

  public async hasCorrectInitialValuesForProcess(brewingProcess: BrewingProcess): Promise<boolean> {
    return (
      this.waterDoseInput.value === "300" &&
      this.coffeeWeightInput.value === "18" &&
      this.grindSizeInput.value === GrindSize.MediumFine
    );
  }

  public async isDisplayingSummaryFor(
    brewingData: BrewingBasicsFormValues & BrewingCustomizationFormValues
  ): Promise<boolean> {
    return (
      !!getByText(this.container, `Coffee Name: ${brewingData.coffeeName}`) &&
      !!getByText(this.container, `Technique: ${brewingData.technique}`) &&
      !!getByText(this.container, `Water: ${brewingData.waterDose}`) &&
      !!getByText(this.container, `Coffee Weight: ${brewingData.coffeeWeight}`) &&
      !!getByText(this.container, `Grind Size: ${brewingData.grindSize}`)
    );
  }

  public get isAddingNewBrew(): boolean {
    return !!queryByText(this.container, "New brew");
  }

  public get isInErrorState(): boolean {
    return this.openBrewCustomizationButton.isDisabled;
  }

  public get isInAnotherErrorState(): boolean {
    return this.saveBrewButton.isDisabled;
  }

  public hasSuccessfulySavedBrew(brewingData: CreateBrewData): boolean {
    expect(this.api.createBrew).toHaveBeenCalledWith(brewingData);
    expect(this.api.getBrews).toHaveBeenCalledTimes(2);
    return window.location.pathname === Routing.Feed;
  }

  private get addNewBrewButton() {
    return new ButtonElement(this.container, "Add new brew");
  }

  private get coffeeNameInput() {
    return new TextInputElement(this.container, "Coffee name");
  }

  private get brewingMethodInput() {
    return new SelectInputElement<BrewingTechnique>(this.container, "Technique");
  }

  private get brewingProcessInput() {
    return new SelectInputElement<BrewingProcess>(this.container, "Process");
  }

  private get waterDoseInput() {
    return new TextInputElement(this.container, "Water");
  }

  private get coffeeWeightInput() {
    return new TextInputElement(this.container, "Coffee weight");
  }

  private get grindSizeInput() {
    return new SelectInputElement<GrindSize>(this.container, "Grind size");
  }

  private get ratingInput() {
    return new SelectInputElement(this.container, "Rating");
  }

  private get rateBrewButton() {
    return new ButtonElement(this.container, "Rate");
  }

  private get openBrewCustomizationButton() {
    return new ButtonElement(this.container, "Customize brew");
  }

  private get saveBrewButton() {
    return new ButtonElement(this.container, "Save brew");
  }
}
