export class Candidate {
    public username: string;
    public description: string;
    public startTime: string;
    public endTime: string;

    constructor(
        username: string,
        description: string,
        startTime: string,
        endTime: string){
            this.username = username;
            this.description = description;
            this.startTime = startTime;
            this.endTime = endTime;
        }
}