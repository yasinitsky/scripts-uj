class Response {
    private errors: Array<string> = new Array()

    public appendError(error: string) : void {
        this.errors.push(error);
    }
}

export default Response;