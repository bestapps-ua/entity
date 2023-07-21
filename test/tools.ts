export function checkUid(uid){
    let m = uid.match(/[a-z0-9]{8}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12}/i);
    expect(m.length === 1).toBe(true);
}
